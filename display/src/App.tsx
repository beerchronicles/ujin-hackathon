import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Carousel } from 'antd';
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div className='gkhNewsContainer'>
        <h1 className='screenHeader'>Новости ЖК</h1>
        <div className='gkhNewsGrid'>
        <div className='CarouselWrap'>
    <Carousel autoplay vertical autoplaySpeed={3000} dots={false} infinite={true}>
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
    </div>
        <ul className='gkhNewsList'>
          <li className='gkhNewsItem'>Заявки через приложение</li>
          <li className='gkhNewsItem'>Шлагбаум на парковке</li>
          <li className='gkhNewsItem'>Благоустройство двора</li>
          <li className='gkhNewsItem'>Обновление камер</li>
          <li className='gkhNewsItem'>Новый домофон</li>
        </ul>
      </div>
    </div>
    <h1 className='screenHeader'>Полезная информация</h1>
      <div className='informDashboardContainer'>
        <div className='informDashboardContainerSection right'>
        <div className='informDashboardRules'>
          <h1 className='informDashboardRulesHeader'>Правила ЖК</h1>
          <ul className='ruleList'>
            <li className='ruleItem'>Правило 1</li>
            <li className='ruleItem'>Правило 2</li>
            <li className='ruleItem'>Правило 3</li>
            <li className='ruleItem'>Правило 4</li>
          </ul>
        </div>
        </div>
        <div className='informDashboardContainerSection left'>
        <div className='informDashboardContacts'>
          <p>Ук ПИРС:  +7 800 555 35 35</p>
          <p>Аварийная служба: +7 800 555 35 35</p>
          <p>Ук ПИРС:  +7 800 555 35 35</p>
          <p>Аварийная служба: +7 800 555 35 35</p>
        </div>
        <div className='informDashboardGrphic'>
          <h1 className='grphicTitle'>График вывоза мусора</h1>
          <div className='infoContainer'></div>
        </div>
        <div className='informDashboardFutureWorks'>
          <h1 className='grphicTitle'>Плановые работы</h1>
          <div className='infoContainer'>
            <p className='infoContainerItem'>Работа 1</p>
          </div>
        </div>
      </div> 
      </div>
      <div className='freeSpaceInfo'>
      <div className='unusedStorages'>Невыкупленные кладовые: 9</div>
      <div className='freeParkingSpaces'>Свободные паркочные места: 11</div>
      </div>
      <div className='footer'>
        <p className='companyName'>ujhin</p>
      </div>
    </>
  )
}

export default App
