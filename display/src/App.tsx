import { useEffect, useState } from 'react'
import './App.css'
import { Carousel, Col, Row } from 'antd';
import { useScreenEvents, type ScreenNotification } from './hooks/useScreenEvents';
function App() {
  const [emergencyMode, setemergencyMode] = useState(false)
  const [flag, setFlag] = useState(false)
  const { events, connected } = useScreenEvents(1);
  useEffect(() => {
    setFlag(true)

    if (flag) return;
      setTimeout(
        ()=> console.log(events[0]), 5000
      )
    console.log(connected);
  }, []); 
  
  return (
    <>
    <div>
        <div>WS: {connected ? "connected" : "disconnected"}</div>

        {events.map((event, index) => (
          <pre key={event.eventId ?? index}>
            {JSON.stringify(event, null, 2)}
          </pre>
        ))}
      </div>
    <h1 className='emergencyBlock' style={{ display: `${emergencyMode == true ? "flex" : "none"}` }}>Опастность!</h1>
    <h1 className='screenHeader'>Новости ЖК</h1>
    <Row className='newsSection'>
      <Col span={2}></Col>
        <Col span={9}>
    <Carousel autoplay autoplaySpeed={3000} dots={false} infinite={true}>
      <div>
          <h1 className='gkhNewsTitle'>Заявки через приложение</h1>
          <p className='gkhNewsText'>Жители ЖК теперь могут отправлять заявки в управляющую компанию через приложение.
Это ускорит обработку обращений и поможет быстрее решать бытовые вопросы</p>
      </div>
      <div>
          <h1 className='gkhNewsTitle'>Шлагбаум на парковке</h1>
          <p className='gkhNewsText'>На въезде в ЖК установили новый автоматический шлагбаум.
Теперь доступ на парковку станет удобнее для жителей и безопаснее для территории.</p>
      </div>
      <div>
          <h1 className='gkhNewsTitle'>Благоустройство двора</h1>
          <p className='gkhNewsText'>Во дворе ЖК завершили работы по благоустройству.
Появились новые зоны отдыха, освещение, дорожки и зелёные насаждения.</p>
      </div>
      <div>
          <h1 className='gkhNewsTitle'>Обновление камер</h1>
          <p className='gkhNewsText'>На территории ЖК обновили систему видеонаблюдения.
Камеры помогут повысить безопасность во дворе, на парковке и у входных групп..</p>
      </div>
      <div>
          <h1 className='gkhNewsTitle'>Новый домофон</h1>
          <p className='gkhNewsText'>В ЖК установили новый умный домофон.
Жители смогут открывать дверь через приложение и получать уведомления о входящих вызовах.</p>
      </div>
    </Carousel>
    </Col>
    <Col span={1}></Col>
    <Col span={10}>
        <ul className='gkhNewsList'>
          <li className='gkhNewsItem'>Заявки через приложение</li>
          <li className='gkhNewsItem'>Шлагбаум на парковке</li>
          <li className='gkhNewsItem'>Благоустройство двора</li>
          <li className='gkhNewsItem'>Обновление камер</li>
          <li className='gkhNewsItem'>Новый домофон</li>
        </ul>
        </Col>
        <Col span={2}></Col>
        </Row>

    

    <h1 className='screenHeader'>Полезная информация</h1>
    <Row className='infoSection'>
      <Col span={2}></Col>
        <Col span={9}>
        <div className='informDashboardRules'>
          <h1 className='informDashboardRulesHeader'>Правила ЖК</h1>
          <ul className='ruleList'>
            <li className='ruleItem'>1. Соблюдайте чистоту в местах общего пользования.</li>
            <li className='ruleItem'>2. Не оставляйте мусор в подъезде, лифте и на лестничных площадках</li>
            <li className='ruleItem'>3. Выносите бытовой мусор только в специально предназначенные контейнеры.</li>
            <li className='ruleItem'>4. Соблюдайте тишину с 22:00 до 08:00.</li>
            <li className='ruleItem'>6. Не загромождайте проходы, лестницы и эвакуационные выходы личными вещами.</li>
            <li className='ruleItem'>7. Бережно относитесь к имуществу ЖК: дверям, лифтам, домофонам, освещению и мебели.</li>
            <li className='ruleItem'>8. Паркуйте автомобили только в разрешённых местах.</li>
            <li className='ruleItem'>9. Не допускайте повреждения газонов, клумб и элементов благоустройства.</li>
            <li className='ruleItem'>10. Выгуливайте домашних животных только в разрешённых зонах.</li>
            <li className='ruleItem'>11. Убирайте за домашними животными на территории ЖК.</li>
            <li className='ruleItem'>12. Не размещайте объявления и рекламные материалы без согласования с управляющей компанией.</li>
            <li className='ruleItem'>13. Сообщайте в УК о поломках, протечках, неисправностях лифтов и освещения.</li>
            <li className='ruleItem'>14. Не храните легковоспламеняющиеся и опасные вещества в местах общего пользования.</li>
            <li className='ruleItem'>15. Соблюдайте правила пожарной безопасности.</li>
            <li className='ruleItem'>16. При возникновении аварийной ситуации немедленно обращайтесь в аварийную службу или УК.</li>
          </ul>
        </div>
        </Col>
        <Col span={1}></Col>
        <Col span={10}>
        <div className='informDashboardContacts'>
          <p className='contactsItem'>Ук ПИРС:  +7 800 555 35 35</p>
          <p className='contactsItem'>Аварийная служба: +7 800 555 35 35</p>
          <p className='contactsItem'>Аварийная служба: +7 800 555 35 35</p>
        </div>
        <div className='informDashboardGrphic'>
          <h1 className='grphicTitle'>График вывоза мусора</h1>
          <div className='infoContainer'>
            <p className='infoContainerItem'>Понедельник — вывоз бытовых отходов с 08:00 до 10:00.</p>
            <p className='infoContainerItem'>Среда — вывоз бытовых отходов с 08:00 до 10:00.</p>
            <p className='infoContainerItem'>Пятница — вывоз бытовых отходов с 08:00 до 10:00.</p>
            <p className='infoContainerItem'>Вторник — вывоз крупногабаритного мусора с 10:00 до 12:00</p>
            <p className='infoContainerItem'>Четверг — вывоз перерабатываемых отходов с 09:00 до 11:00.</p>
            <p className='infoContainerItem'>Суббота — дополнительный вывоз мусора при повышенной загрузке контейнеров</p>
          </div>
        </div>
        <div className='informDashboardFutureWorks'>
          <h1 className='grphicTitle'>Плановые работы</h1>
          <div className='infoContainer'>
            <p className='infoContainerItem'>10 июня, 09:00–13:00 — проверка системы видеонаблюдения.</p>
            <p className='infoContainerItem'>12 июня, 10:00–15:00 — техническое обслуживание лифтов.</p>
            <p className='infoContainerItem'>14 июня, 08:00–12:00 — уборка и мойка входных групп.</p>
            <p className='infoContainerItem'>17 июня, 09:00–18:00 — профилактика системы домофонии.</p>
            <p className='infoContainerItem'>19 июня, 11:00–16:00 — проверка пожарной сигнализации.</p>
            <p className='infoContainerItem'>21 июня, 09:00–14:00 — обслуживание освещения во дворе и паркинге.</p>
          </div>
        </div>
      </Col>
      <Col span={2}></Col>
      </Row>

      <Row className='freeSpaceInfo'>
        <Col span={2}></Col>
      <Col span={9} className='unusedStorages'>Невыкупленные кладовые: 9</Col>
      <Col span={1} className='divider'></Col>
      <Col span={1}></Col>
      <Col span={9} className='freeParkingSpaces'>Свободные паркочные места: 11</Col>
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
