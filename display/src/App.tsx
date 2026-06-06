import {useEffect, useMemo, useState} from 'react'
import './App.css'
import {Carousel, Col, Row} from 'antd';
import {type ScreenNotification, useScreenEvents} from './hooks/useScreenEvents';

type NewsItem = {
  id?: number;
  newsId?: number;
  title: string;
  content: string;
  image?: string;
  publishedAt?: string;
};

type TemplatePayload = {
  id?: number;
  name?: string;
  scrollTime?: number;
  mainBlockImage?: string;
  mainBlockContent?: string;
  mainBlockTitle?: string;
  block1Content?: string;
  block2Content?: string;
  block1Title?: string;
  block2Title?: string;
  contact1Name?: string;
  contact1Phone?: string;
  contact2Name?: string;
  contact2Phone?: string;
  contact3Name?: string;
  contact3Phone?: string;
  contact4Name?: string;
  contact4Phone?: string;
};

type TemplateContact = {
  name: string;
  phone: string;
};

type DisplayAvailability = {
  freeStorages: number;
  freeParkings: number;
};

const NEWS_UPDATED_EVENT = 'NEWS_UPDATED';
const TEMPLATE_EVENT_TYPES = new Set(['TEMPLATE_CURRENT', 'TEMPLATE_UPDATED']);
const BACKEND_HTTP_URL = import.meta.env.VITE_BACKEND_HTTP_URL ?? 'http://localhost:8080';
const DEFAULT_AUTOPLAY_SPEED = 3000;
const SCREEN_ID = 1;
const AVAILABILITY_REFRESH_INTERVAL = 60_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeNewsPayload(payload: unknown): NewsItem[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.flatMap((item) => {
    if (!isRecord(item) || typeof item.title !== 'string' || typeof item.content !== 'string') {
      return [];
    }

    return {
      id: typeof item.id === 'number' ? item.id : undefined,
      newsId: typeof item.newsId === 'number' ? item.newsId : undefined,
      title: item.title,
      content: item.content,
      image: typeof item.image === 'string' ? item.image : undefined,
      publishedAt: typeof item.publishedAt === 'string' ? item.publishedAt : undefined,
    };
  });
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function normalizeTemplatePayload(payload: unknown): TemplatePayload | undefined {
  if (!isRecord(payload)) {
    return undefined;
  }

  return {
    id: typeof payload.id === 'number' ? payload.id : undefined,
    name: readString(payload.name),
    scrollTime: typeof payload.scrollTime === 'number' ? payload.scrollTime : undefined,
    mainBlockImage: readString(payload.mainBlockImage),
    mainBlockContent: readString(payload.mainBlockContent),
    mainBlockTitle: readString(payload.mainBlockTitle),
    block1Content: readString(payload.block1Content),
    block2Content: readString(payload.block2Content),
    block1Title: readString(payload.block1Title),
    block2Title: readString(payload.block2Title),
    contact1Name: readString(payload.contact1Name),
    contact1Phone: readString(payload.contact1Phone),
    contact2Name: readString(payload.contact2Name),
    contact2Phone: readString(payload.contact2Phone),
    contact3Name: readString(payload.contact3Name),
    contact3Phone: readString(payload.contact3Phone),
    contact4Name: readString(payload.contact4Name),
    contact4Phone: readString(payload.contact4Phone),
  };
}

function getTemplateContacts(template: TemplatePayload | undefined): TemplateContact[] {
  if (!template) {
    return [];
  }

  return [
    [template.contact1Name, template.contact1Phone],
    [template.contact2Name, template.contact2Phone],
    [template.contact3Name, template.contact3Phone],
    [template.contact4Name, template.contact4Phone],
  ].flatMap(([name, phone]) => (name && phone ? [{name, phone}] : []));
}

function sanitizeHtml(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');

  document.querySelectorAll('script, iframe, object, embed, link, meta').forEach((node) => node.remove());
  document.body.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();

      if (name.startsWith('on') || value.startsWith('javascript:')) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return document.body.innerHTML;
}

function getImageUrl(imageKey: string | undefined) {
  if (!imageKey) {
    return undefined;
  }

  if (/^https?:\/\//i.test(imageKey)) {
    return imageKey;
  }

  return `${BACKEND_HTTP_URL}/images/${encodeURIComponent(imageKey)}`;
}

function getEventTimestamp(event: ScreenNotification) {
  const timestamp = Date.parse(event.createdAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getLatestNewsEvent(events: ScreenNotification[]) {
  return events
    .filter((event) => event.eventType === NEWS_UPDATED_EVENT)
    .reduce<ScreenNotification | undefined>((latest, event) => {
      if (!latest) {
        return event;
      }

      const latestTimestamp = getEventTimestamp(latest);
      const eventTimestamp = getEventTimestamp(event);

      if (eventTimestamp !== latestTimestamp) {
        return eventTimestamp > latestTimestamp ? event : latest;
      }

      return (event.eventId ?? 0) > (latest.eventId ?? 0) ? event : latest;
    }, undefined);
}

function getLatestTemplateEvent(events: ScreenNotification[]) {
  return events
    .filter((event) => TEMPLATE_EVENT_TYPES.has(event.eventType))
    .reduce<ScreenNotification | undefined>((latest, event) => {
      if (!latest) {
        return event;
      }

      const latestTimestamp = getEventTimestamp(latest);
      const eventTimestamp = getEventTimestamp(event);

      if (eventTimestamp !== latestTimestamp) {
        return eventTimestamp > latestTimestamp ? event : latest;
      }

      return (event.eventId ?? 0) > (latest.eventId ?? 0) ? event : latest;
    }, undefined);
}

function getAutoplaySpeed(template: TemplatePayload | undefined) {
  return template?.scrollTime && template.scrollTime > 0 ? template.scrollTime : DEFAULT_AUTOPLAY_SPEED;
}

async function loadAvailability(screenId: number): Promise<DisplayAvailability> {
  const response = await fetch(`${BACKEND_HTTP_URL}/display/screens/${screenId}/availability`);

  if (!response.ok) {
    throw new Error(`Availability request failed: ${response.status}`);
  }

  return response.json() as Promise<DisplayAvailability>;
}

function TemplateHtml({content}: {content: string | undefined}) {
  if (!content) {
    return null;
  }

  return <div dangerouslySetInnerHTML={{__html: sanitizeHtml(content)}} />;
}

function TemplateInfoBlock({title, content}: {title: string | undefined; content: string | undefined}) {
  if (!title && !content) {
    return null;
  }

  return (
    <div className='informDashboardBlock'>
      {title && <h1 className='grphicTitle'>{title}</h1>}
      {content && (
        <div className='infoContainer'>
          <div className='infoContainerItem'>
            <TemplateHtml content={content} />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const emergencyMode = false;
  const { events } = useScreenEvents(SCREEN_ID);
  const [availability, setAvailability] = useState<DisplayAvailability | undefined>();
  const news = useMemo(() => {
    const latestNewsEvent = getLatestNewsEvent(events);
    return latestNewsEvent ? normalizeNewsPayload(latestNewsEvent.payload) : [];
  }, [events]);
  const template = useMemo(() => {
    const latestTemplateEvent = getLatestTemplateEvent(events);
    return latestTemplateEvent ? normalizeTemplatePayload(latestTemplateEvent.payload) : undefined;
  }, [events]);
  const contacts = useMemo(() => getTemplateContacts(template), [template]);
  const mainBlockImageUrl = getImageUrl(template?.mainBlockImage);
  const autoplaySpeed = getAutoplaySpeed(template);

  useEffect(() => {
    let ignore = false;

    const refreshAvailability = () => {
      loadAvailability(SCREEN_ID)
        .then((value) => {
          if (!ignore) {
            setAvailability(value);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    refreshAvailability();
    const intervalId = window.setInterval(refreshAvailability, AVAILABILITY_REFRESH_INTERVAL);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, []);
  
  return (
    <>
    <h1 className='emergencyBlock' style={{ display: emergencyMode ? "flex" : "none" }}>Опастность!</h1>
    <h1 className='screenHeader'>Новости ЖК</h1>
    <Row className='newsSection'>
      <Col span={2}></Col>
        <Col span={9}>
    {news.length > 0 ? (
      <Carousel autoplay autoplaySpeed={autoplaySpeed} dots={false} infinite={true}>
        {news.map((item) => {
          const imageUrl = getImageUrl(item.image);

          return (
            <div key={item.id ?? item.newsId ?? item.publishedAt ?? item.title}>
              <h1 className='gkhNewsTitle'>{item.title}</h1>
              <div className='gkhNewsText'>
                {imageUrl && <img className='gkhNewsImage' src={imageUrl} alt='' />}
                <div dangerouslySetInnerHTML={{__html: sanitizeHtml(item.content)}} />
              </div>
            </div>
          );
        })}
      </Carousel>
    ) : (
      <div>
        <h1 className='gkhNewsTitle'>Нет новостей</h1>
        <p className='gkhNewsText'>Актуальные новости появятся после получения события.</p>
      </div>
    )}
    </Col>
    <Col span={1}></Col>
    <Col span={10}>
        <ul className='gkhNewsList'>
          {news.map((item) => (
            <li className='gkhNewsItem' key={item.id ?? item.newsId ?? item.publishedAt ?? item.title}>
              {item.title}
            </li>
          ))}
        </ul>
        </Col>
        <Col span={2}></Col>
        </Row>

    

    <h1 className='screenHeader'>Полезная информация</h1>
    <Row className='infoSection'>
      <Col span={2}></Col>
        <Col span={9}>
        <div className='informDashboardRules'>
          {template?.mainBlockTitle && (
            <h1 className='informDashboardRulesHeader'>{template.mainBlockTitle}</h1>
          )}
          {mainBlockImageUrl && (
            <img className='templateMainBlockImage' src={mainBlockImageUrl} alt='' />
          )}
          <div className='templateMainBlockContent'>
            <TemplateHtml content={template?.mainBlockContent} />
          </div>
        </div>
        </Col>
        <Col span={1}></Col>
        <Col span={10}>
        {contacts.length > 0 && (
          <div className='informDashboardContacts'>
            {contacts.map((contact) => (
              <p className='contactsItem' key={`${contact.name}:${contact.phone}`}>
                {contact.name}: {contact.phone}
              </p>
            ))}
          </div>
        )}
        <TemplateInfoBlock title={template?.block1Title} content={template?.block1Content} />
        <TemplateInfoBlock title={template?.block2Title} content={template?.block2Content} />
      </Col>
      <Col span={2}></Col>
      </Row>

      <Row className='freeSpaceInfo'>
        <Col span={2}></Col>
      <Col span={9} className='unusedStorages'>
        Невыкупленные кладовые: {availability?.freeStorages ?? '...'}
      </Col>
      <Col span={1} className='divider'></Col>
      <Col span={1}></Col>
      <Col span={9} className='freeParkingSpaces'>
        Свободные парковочные места: {availability?.freeParkings ?? '...'}
      </Col>
      <Col span={2}></Col>
      </Row>
      <Row className='footer' >
        <Col span={20}></Col>
        <Col span={2} className='companyName'>ujhin</Col>
        <Col span={2}></Col>
      </Row>
    </>
  )
}

export default App
