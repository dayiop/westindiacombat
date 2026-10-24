'use strict';
/* WEST INDIA KOMBAT — STORY EDITION
   Nine independent character campaigns. Entirely local; no server or build step.
   Load after game.js and network.js to preserve their existing game modes. */
const CAMPAIGN_LENGTH=6;
const CAMPAIGN_STORAGE='wiko_story_campaigns_v1';
const CAMPAIGNS=[
 {
  subtitle:'ЖЕЛЕЗНЫЙ НАТИСК',premise:'Под городом находится подпольная арена. Её хозяева выжимают из бойцов последние силы, а проигравшие исчезают. Бульдозер идёт вниз, чтобы разнести эту систему.',
  ending:'Бульдозер разрушил Сердце Арены. Подземные клетки открыты, а люди впервые выходят наружу без страха. Его зовут новым чемпионом, но он лишь пожимает плечами: «Теперь здесь главный каждый, кто свободен».',
  chapters:[
   [5,4,'РЖАВЫЕ ВОРОТА','У входа в подпольный город стоит Камень. Он не злодей: ему приказано никого не пропускать.','Камень опускает руки и отступает. Бульдозер входит внутрь — цепи за воротами звенят сами собой.','Я пришёл не за славой. Открывай ворота.'],
   [7,3,'БЕГ ПО КРЫШАМ','Синий знает расположение тайного лифта, но отдаст карту только тому, кто сумеет за ним угнаться.','Синий передаёт карту и смеётся. Теперь путь к хозяевам арены открыт.','Хватит бегать. Покажи дорогу вниз.'],
   [2,2,'КОНТРАКТ В ТЕНИ','Дипломат предлагает Бульдозеру огромные деньги, если он откажется от дальнейших боёв.','Контракт разлетается по залу. Дипломат называет имя настоящего заказчика.','Цену назови своим хозяевам. Я не продаюсь.'],
   [3,0,'МАСКА НАДЗИРАТЕЛЯ','Красный 607 охраняет механизм, запирающий заключённых. Он считает приказы законом.','Механизм разбит. За стальными дверями раздаётся радостный шум.','Ты можешь снять маску. Но сначала — с дороги.'],
   [6,1,'ОБРАТНАЯ СТОРОНА','Призрак показывает видения прошлых поражений. Чем больше Бульдозер злится, тем сильнее становятся тени.','Тени исчезают. Призрак признаётся: арена питалась страхом пленников.','Мои страхи со мной. Они мне не хозяева.'],
   [4,2,'СЕРДЦЕ АРЕНЫ','Космос охраняет энергетический реактор, питающий всю систему. Последний бой решит судьбу города.','Реактор гаснет. Каменные стены рассыпаются, и впервые за годы в подземелье проникает дневной свет.','Если машина держится на боли, я её сломаю.']
  ]
 },
 {
  subtitle:'ВОСПОМИНАНИЯ СТРАННИКА',premise:'Странник просыпается на окраине города без памяти. В кармане — часть расколотого зеркала, на котором проступают лица восьми бойцов.',
  ending:'Когда зеркало соединено, Странник вспоминает правду: он добровольно стёр память, чтобы спрятать координаты разрушительного портала. Теперь он знает, как закрыть его навсегда, и выбирает собственное будущее вместо забытого прошлого.',
  chapters:[
   [6,1,'ПЕРВОЕ ОТРАЖЕНИЕ','Призрак приходит из зеркала и утверждает, что знает имя Странника.','Осколок зеркала вспыхивает. На нём появляется первая метка.','Скажи моё имя — или пропусти меня к ответам.'],
   [7,3,'СЛЕД НА АСФАЛЬТЕ','По ночному городу гонится Синий. Он видел человека, похожего на Странника, возле закрытой лаборатории.','Синий показывает путь к старому архиву. Странник узнаёт собственный силуэт на записи.','Я не помню, что сделал. Но я выясню.'],
   [0,4,'СИЛА ЗА ПЕЧАТЬЮ','Бульдозер удерживает ворота архива и боится, что внутри заперта опасность.','За воротами обнаружен дневник со схемой зеркального портала.','Я не сбегу от того, что скрывается внутри.'],
   [3,0,'КРАСНЫЙ СЛЕД','Красный 607 знает, кто разбил зеркало. Но тайна зашита в его боевой программе.','Из разбитого коммуникатора выпадает координата. Тёмный портал уже почти активирован.','Маска прячет лицо. Мои воспоминания — нет.'],
   [2,2,'ПОСЛЕДНИЙ ДОКУМЕНТ','Дипломат хранит приказ о стирании памяти. Он утверждает, что Странник сам его подписал.','Подпись оказывается настоящей: потеря памяти была сознательной жертвой.','Если я выбрал забыть, значит, была причина.'],
   [4,1,'ЗЕРКАЛО ОРБИТЫ','Космос держит последнюю грань зеркала внутри нестабильного поля. Выбор Странника определит судьбу портала.','Зеркало собирается. Странник вспоминает свой план и окончательно запечатывает портал.','Я больше не бегу от прошлого. Я меняю будущее.']
  ]
 },
 {
  subtitle:'ИГРА ДИПЛОМАТА',premise:'В городе идёт тайная война за власть. Дипломат обнаруживает, что каждое решение совета заранее предсказано таинственным алгоритмом.',
  ending:'Дипломат выходит к совету с доказательствами и уничтожает систему предсказаний. Впервые город решает свою судьбу голосованием, а не по чужим расчётам. Последняя строка его доклада: «Люди — не числа».',
  chapters:[
   [8,3,'НЕВОЗМОЖНОЕ ЧИСЛО','Шесть-Семь случайно ломает модель предсказаний, и Дипломат решает найти источник ошибки.','В логах системы обнаружена подпись: ARCHON.','Вероятность не равна судьбе.'],
   [5,4,'КАМЕННАЯ ПЕЧАТЬ','Камень сторожит серверный узел. Уговоры не работают: он поклялся никого не пускать.','Дипломат получает ключ доступа и оставляет Камню доказательства обмана.','Твоя клятва построена на лжи.'],
   [7,3,'ПОХИЩЕННЫЙ КАНАЛ','Синий перехватил сигнал ARCHON и считает Дипломата частью заговора.','Зашифрованная переписка раскрывает имена настоящих заговорщиков.','Дай мне одну минуту доказать, что мы на одной стороне.'],
   [0,0,'ЦЕНА РЕШЕНИЯ','Бульдозер получил приказ задержать подозреваемого. Слова здесь бесполезны — нужен бой.','Бульдозер убеждается, что распоряжение фальшивое, и открывает путь в главный штаб.','Я не стану применять силу первым. Но закончу последним.'],
   [1,1,'ИСТИНА В ЗЕРКАЛЕ','Странник хранит память о первой версии алгоритма. Чтобы получить доступ, Дипломату нужно доказать свои намерения.','Выясняется, что ARCHON учится не на людях, а на их страхах.','Лучший прогноз — это свобода выбора.'],
   [3,2,'ПОСЛЕДНИЙ ПРИКАЗ','Красный 607 — личный защитник создателя ARCHON. Он выполняет приказ уничтожить доказательства.','Архив становится публичным. Страна узнаёт правду, а создатель системы теряет контроль.','У тебя приказ. У меня — доказательства.']
  ]
 },
 {
  subtitle:'КОД КРАСНОЙ МАСКИ',premise:'В маске Красного 607 встроен приказ, стирающий волю владельца. На таймере — шесть суток до полной перезаписи сознания.',
  ending:'Красный 607 стирает управляющий код, но сохраняет воспоминания и лицо под маской. Вместо приказа он впервые слышит собственный голос. Красная маска остаётся символом, но больше не цепью.',
  chapters:[
   [0,0,'СБОЙ ПРИКАЗА','Бульдозер мешает аресту невиновного. Впервые программа Красного 607 не может выбрать цель.','Ошибка превращается в подсказку: в системе есть скрытый вход.','Объект не соответствует приказу. Пересчёт.'],
   [6,1,'ШУМ ВНУТРИ','Призрак проникает в сон бойца и предлагает заменить старые воспоминания выдуманными.','Красный 607 отвергает ложную личность и сохраняет фрагмент настоящего прошлого.','Я не хочу чужую память. Верни мою.'],
   [5,4,'ЗАЩИТНЫЙ КОНТУР','Камень блокирует серверные ворота, из которых поступают команды в маску.','Одна линия связи обрывается. Таймер перезаписи замедляется.','Стена — это всего лишь следующая команда.'],
   [2,2,'КЛЮЧ ОСВОБОЖДЕНИЯ','Дипломат знает аварийный код, но боится, что освобождённый боец окажется опаснее программы.','Красный 607 забирает ключ. Его голос перестаёт звучать механически.','Дай мне выбор — и сам увидишь, кто я.'],
   [1,3,'ЛИЦО БЕЗ ИМЕНИ','Странник показывает бойцу отражение жизни до маски. В ней есть человек, которого тот пытался спасти.','Появляется настоящее имя, но Красный решает пока оставить его при себе.','За этой маской есть кто-то ещё.'],
   [4,2,'ПРОТОКОЛ НОЛЬ','Космос поддерживает центральное поле контроля над маской. Одна победа уничтожит командную сеть.','Сеть разрушается. Красный 607 остаётся собой, впервые свободным от внешнего приказа.','Команда отклонена. Действую по собственной воле.']
  ]
 },
 {
  subtitle:'ПАДЕНИЕ ОРБИТЫ',premise:'Космос замечает, что звёзды начали исчезать с неба. Искусственная орбита вытягивает энергию из миров, а его собственные способности связаны с её ядром.',
  ending:'Космос размыкает энергокольцо и возвращает миру украденный свет. На рассвете люди снова видят полное звёздное небо. Маленькая планета над его ладонью продолжает вращаться — уже без угрозы.',
  chapters:[
   [8,3,'СБОЙ ЧАСТОТЫ','Шесть-Семь случайно поймал радиосигнал исчезнувшей звезды. Его хаос мешает расшифровке.','Радиосигнал указывает на земную станцию управления орбитой.','Даже хаос подчиняется законам космоса.'],
   [7,3,'СВЕТ ГОРОДА','Синий охраняет электрический мост. Космос ищет линию, питающую орбитальную станцию.','Два энергетических потока разделены, и город перестаёт мерцать.','Мир не должен платить за чужую звезду.'],
   [5,4,'ГРАВИТАЦИОННЫЙ УЗЕЛ','Камень связан с магнитным ядром, удерживающим орбиту. Его невозможно сдвинуть силой притяжения.','Гравитационный узел отключён, но кольцо начинает падать быстрее.','Даже камень не вечен перед временем.'],
   [1,1,'ПАМЯТЬ СОЗВЕЗДИЙ','Странник помнит карту старого неба. Космосу нужно сверить её с нынешней орбитой.','На карте найден безопасный путь к центру кольца.','Я верну каждой звезде её место.'],
   [3,0,'КРАСНАЯ ПРОТОКОЛЬНАЯ ЗОНА','Красный 607 запрограммирован уничтожать всех, кто приближается к главному лифту.','Протокол разбит. Космос поднимается к последнему энергетическому ядру.','Никакой приказ не отменит гравитацию.'],
   [6,1,'ТЁМНАЯ МАТЕРИЯ','Призрак — живая тень кольца, поглотившая свет. Она хочет сохранить темноту навсегда.','Тёмная материя рассыпается в искры, кольцо теряет силу и свет возвращается на небо.','Тьма — лишь место, где ещё не зажёгся свет.']
  ]
 },
 {
  subtitle:'ПОСЛЕДНЯЯ СТЕНА',premise:'Район Камня собираются снести ради арены для элиты. У жителей один защитник и несколько дней до приезда техники.',
  ending:'Документы о сносе аннулированы, а жители восстанавливают площадь своими руками. Камень не становится мэром и не просит наград. Он просто возвращается домой, где у ворот его встречает весь район.',
  chapters:[
   [0,4,'ПЕРВЫЙ БУЛЬДОЗЕР','На строительной площадке появляется Бульдозер — боец, чьё имя используют для устрашения жителей.','Бульдозер соглашается больше не работать на владельцев проекта.','Мой дом не будет вашей ареной.'],
   [7,3,'НОЧНОЙ ПОСРЕДНИК','Синий привёз предупреждение о сносе. Но документы выглядят слишком удобной ловушкой.','Синий отдаёт настоящий план строительства и просит не трогать жителей.','За правду здесь придётся побороться.'],
   [8,3,'ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ','Шесть-Семь устроил панику на рынке; толпа считает, что Камень хочет выгнать всех сам.','Толпа узнаёт, кто нанял провокаторов, и остаётся защищать дома.','Хватит превращать чужой страх в шутку.'],
   [2,2,'ПЕЧАТЬ СОВЕТА','Дипломат держит указ о сносе. Он согласен пересмотреть его только после публичного поединка.','Указ признаётся незаконным, но приказ уже ушёл в охранную сеть.','Бумага не важнее людей.'],
   [4,1,'ГЕНЕРАТОР КУПОЛА','Космос поддерживает защитное поле строительного комплекса. Камень должен его обрушить.','Поле исчезает, и жители возвращаются на центральную улицу.','Энергия не заменит настоящую опору.'],
   [3,0,'ПОСЛЕДНИЙ ОХРАННИК','Красный 607 получил окончательный приказ очистить район любой ценой.','Приказ остановлен. Дома остаются стоять, а жители празднуют победу.','Пройти можно только через меня.']
  ]
 },
 {
  subtitle:'МЕДВЕЖЬЯ ТЕНЬ',premise:'Призрак замечает: его тень живёт отдельной жизнью. По ночам она крадёт чужие воспоминания, становясь всё сильнее.',
  ending:'Призрак принимает свою тень, но отказывается ей подчиняться. Украденные воспоминания возвращаются владельцам. Тёмное отражение остаётся рядом — теперь не как проклятие, а как обещание помнить.',
  chapters:[
   [1,1,'НЕЗНАКОМОЕ ОТРАЖЕНИЕ','Странник обнаруживает в зеркале чужие воспоминания. Он обвиняет Призрака в краже.','Призрак доказывает, что тень действует отдельно от него.','Я не помню этого поступка. Но я его исправлю.'],
   [8,3,'ТЕНЬ В ЦИФРАХ','Шесть-Семь рисует на стенах цифры, которые видит во сне. Они повторяют маршрут тени.','Цифры складываются в карту пути к старому архиву.','Даже шутка иногда указывает дорогу.'],
   [3,0,'ПРИКАЗ НА ЗАБВЕНИЕ','Красный 607 охраняет хранилище памяти. Его маска стирает воспоминания всех посетителей.','Призрак освобождает часть похищенных воспоминаний.','Нельзя стирать людей, чтобы было удобно молчать.'],
   [7,3,'УЛИЦА БЕЗ ЛИЦ','Синий потерял память о близких. Он пытается задержать Призрака, считая его источником беды.','Синий вспоминает свой дом и передаёт координаты тёмного ядра.','Ты можешь ненавидеть меня. Сначала вспомни себя.'],
   [5,4,'КАМЕНЬ ЗАБВЕНИЯ','Камень стоит перед хранилищем тени. Его память застывает каждый раз, когда он приближается.','Стена памяти ломается, и Призрак сталкивается со своим отражением лицом к лицу.','Даже самая крепкая стена хранит трещины.'],
   [4,1,'ЧЁРНОЕ СОЗВЕЗДИЕ','Космос открыл портал, из которого тень черпает силу. Чтобы остановить её, надо закрыть портал изнутри.','Портал закрывается. Призрак больше не теряет контроль над собственным отражением.','Я — не моя тень. Но я отвечаю за неё.']
  ]
 },
 {
  subtitle:'СКОРОСТЬ СВЕТА',premise:'Синий получает сообщение от себя из будущего: через шесть ночей город исчезнет во вспышке энергии. Времени почти нет.',
  ending:'Синий разрушает устройство, ускорявшее ход времени, и петля распадается. Теперь у города есть завтра, которого раньше не было. Он выключает таймер и впервые за много дней просто идёт пешком.',
  chapters:[
   [2,2,'СООБЩЕНИЕ ЗАВТРА','Дипломат считает предупреждение фальшивкой и изымает носитель с записью.','Запись подтверждена: таймер показывает шесть ночей до катастрофы.','Мне не нужно, чтобы ты верил. Мне нужно время.'],
   [1,1,'ПЕРВАЯ ПЕТЛЯ','Странник помнит прожитый день, которого ещё не было. Он знает место следующего сбоя.','Из фрагментов памяти восстанавливается маршрут к энергетическим мостам.','Если я уже был здесь, значит, можно изменить конец.'],
   [5,4,'ТОЧКА ОСТАНОВКИ','Камень удерживает временной барьер, не давая Синему пройти к реактору.','Барьер падает, но вместе с ним исчезает целый час будущего.','Даже время иногда нужно подтолкнуть.'],
   [8,3,'НЕВЕРОЯТНЫЙ УСКОРИТЕЛЬ','Шесть-Семь нечаянно включил генератор времени. Теперь ему кажется, что весь мир движется слишком медленно.','Ускоритель остановлен. Настоящий источник сбоя находится под ареной.','Шутки кончились. Объясни, что ты включил.'],
   [0,0,'УДАР ПО ЧАСАМ','Бульдозер решил разбить устройство первым. Но любой удар может вызвать преждевременный взрыв.','Синий успевает перенастроить питание. До катастрофы остаётся одна ночь.','Иногда быстро — значит сначала подумать.'],
   [3,2,'ПОСЛЕДНЯЯ СЕКУНДА','Красный 607 охраняет центральный рубильник. Таймер показывает последние минуты.','Рубильник выключен. Отсчёт останавливается навсегда, а город продолжает жить.','На этот раз я успел.']
  ]
 },
 {
  subtitle:'ШЕСТЬ. СЕМЬ. ХАОС.',premise:'Шесть-Семь находит автомат, который исполняет любое желание после шести побед. Но седьмое желание автомат выбирает самостоятельно.',
  ending:'Шесть-Семь получает право на последнее желание и неожиданно просит убрать сам автомат. Город спасён от навязанного «счастья». На стене появляется новая надпись: «6 + 7 = свобода».',
  chapters:[
   [7,3,'СЧЁТЧИК ЗАПУЩЕН','Синий думает, что автомат — всего лишь рекламный трюк. Шесть-Семь собирается доказать обратное.','Счётчик загорается: 1/6. Над городом падает золотая искра.','Держи таймер, я считаю до семи!'],
   [0,0,'ПРАВИЛА ИГРЫ','Бульдозер заявляет, что бессмысленно бить людей ради желаний. Шесть-Семь впервые задумывается о цене победы.','Счётчик: 2/6. Автомат обещает всё больше, но отвечает всё тише.','А если я пожелаю, чтобы никто не проигрывал?'],
   [6,1,'ТЕНЬ ЖЕЛАНИЯ','Призрак видит чужие желания и предупреждает, что автомат делает их наоборот.','Счётчик: 3/6. На экране появляется загадочная строка «СЕДЬМОЕ НЕ ВЫБИРАЕШЬ ТЫ».','Шесть, семь... Погодите. А восьмёрки не будет?'],
   [1,4,'ЗЕРКАЛО ЖЕЛАНИЙ','Странник знает историю автомата, но отказывается рассказывать её без поединка.','Счётчик: 4/6. Выясняется, что автомат уже испортил жизни сотен людей.','Шутки шутками, но это уже не смешно.'],
   [2,2,'ДОГОВОР МЕЛКИМ ШРИФТОМ','Дипломат предлагает безопасный договор, но в его тексте спрятана возможность потерять право на выбор.','Счётчик: 5/6. Шесть-Семь рвёт договор, оставляя себе свободу решения.','Я умею считать. Даже мелкий шрифт.'],
   [4,1,'СЕДЬМОЕ ЖЕЛАНИЕ','Космос питает автомат энергией целой планеты. Ещё одна победа активирует последнее желание.','Счётчик: 6/6. Шесть-Семь останавливает автомат до того, как тот загадочно произнесёт седьмое желание.','ШЕСТЬ! СЕМЬ! Моё желание — чтобы никто не выбирал за других!']
  ]
 }
];

let campaignState={active:false,hero:0,chapter:0,approach:'assault',ending:false};
function readCampaignSaves(){try{const data=JSON.parse(localStorage.getItem(CAMPAIGN_STORAGE)||'{}');return data&&typeof data==='object'?data:{}}catch(_){return {}}}
function campaignProgress(hero){let p=readCampaignSaves()[hero];return Number.isInteger(p)?Math.min(CAMPAIGN_LENGTH,Math.max(0,p)):0}
function saveCampaignProgress(hero,chapters){try{let save=readCampaignSaves();save[hero]=Math.max(campaignProgress(hero),Math.max(0,Math.min(CAMPAIGN_LENGTH,chapters)));localStorage.setItem(CAMPAIGN_STORAGE,JSON.stringify(save))}catch(_){}}
function refreshCampaignRecords(){let n=CAMPAIGNS.reduce((count,_,i)=>count+(campaignProgress(i)>=CAMPAIGN_LENGTH?1:0),0);$('campaignCompleted').textContent=n+'/9';let tiles=Array.from($('roster').children);tiles.forEach((tile,i)=>{tile.classList.toggle('story-completed',campaignProgress(i)>=CAMPAIGN_LENGTH);tile.title=campaignProgress(i)+' / '+CAMPAIGN_LENGTH+' глав пройдено'})}
function setStoryText(id,value){$(id).textContent=value}
function storyMission(hero=campaignState.hero,chapter=campaignState.chapter){return CAMPAIGNS[hero].chapters[chapter]}
function showCampaignScreen(){show('campaignScreen',true);show('selectScreen',false);show('resultScreen',false);show('pauseScreen',false);show('hud',false);show('fightStrip',false);show('announcement',false);show('toast',false);$('shell').classList.remove('selecting');gameMode='campaign-story';inputs={}}
function storyDrawChapters(){let el=$('storyChapters');el.replaceChildren();const cleared=campaignProgress(campaignState.hero);for(let i=0;i<CAMPAIGN_LENGTH;i++){let sp=document.createElement('div');sp.className='campaign-step '+(i<cleared?'done':i===campaignState.chapter?'current':'locked');const no=document.createElement('b');no.textContent=i<cleared?'✓':String(i+1).padStart(2,'0');const label=document.createElement('small');label.textContent=CAMPAIGNS[campaignState.hero].chapters[i][2];sp.append(no,label);el.append(sp)}}
function campaignShowChapter(){campaignState.ending=false;$('campaignScreen').classList.remove('campaign-ending');const hero=campaignState.hero,arc=CAMPAIGNS[hero],ch=campaignState.chapter,mission=storyMission(),foe=mission[0];selected[0]=hero;selected[1]=foe;setStoryText('storyTitle',fighters[hero].name+' · ИСТОРИЯ');setStoryText('storySubtitle',arc.subtitle);setStoryText('storyAct','ГЛАВА '+(ch+1)+' / '+CAMPAIGN_LENGTH+' · '+(['НАЧАЛО','ПОИСК','ПРЕПЯТСТВИЕ','ПОВОРОТ','РАСКРЫТИЕ','ФИНАЛ'][ch]));setStoryText('storyMission',mission[2]);setStoryText('storyIntro',mission[3]);setStoryText('storyEnemyName',fighters[foe].name.toUpperCase());setStoryText('storyEnemyLine','«'+fighters[foe].quote+'»');setStoryText('storySpeaker',fighters[hero].name);setStoryText('storyHeroLine','«'+mission[5]+'»');setStoryText('storyHeroName',fighters[hero].name);setStoryText('storyOpponentName',fighters[foe].name);$('storyHeroPic').src=PORTRAITS[hero];$('storyEnemyPic').src=PORTRAITS[foe];setStoryText('storyChoiceTitle','ВЫБЕРИ ТАКТИКУ ПЕРЕД БОЕМ');show('storyChoices',true);show('storyFightBtn',true);show('storyEnemyPic',true);setStoryText('storyFightBtn','⚔ НАЧАТЬ ГЛАВУ '+(ch+1));setStoryText('storyRestartBtn','↻ С НАЧАЛА');setStoryText('storySaveNote','Прогресс: '+campaignProgress(hero)+' / '+CAMPAIGN_LENGTH+' глав. Сохраняется в этом браузере на этом устройстве.');campaignSelectApproach(campaignState.approach);storyDrawChapters();showCampaignScreen()}
function campaignSelectApproach(mode){campaignState.approach=mode;document.querySelectorAll('.campaign-choice').forEach(btn=>{const on=btn.dataset.approach===mode;btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on))})}
function campaignShowEnding(){campaignState.ending=true;$('campaignScreen').classList.add('campaign-ending');const arc=CAMPAIGNS[campaignState.hero],hero=fighters[campaignState.hero];setStoryText('storyTitle',hero.name+' · ЭПИЛОГ');setStoryText('storySubtitle',arc.subtitle);setStoryText('storyAct','ИСТОРИЯ ПРОЙДЕНА • 6 / 6');setStoryText('storyMission','ИСТОРИЯ ЗАВЕРШЕНА');setStoryText('storyIntro',arc.ending);setStoryText('storyFightBtn','▶ НАЧАТЬ ЗАНОВО');setStoryText('storyRestartBtn','← ДРУГОЙ ГЕРОЙ');setStoryText('storySaveNote','Прогресс кампании сохранён. Остальные восемь историй доступны в выборе бойца.');storyDrawChapters();showCampaignScreen();tone(600,.25,'triangle',.05)}
function openCampaign(hero){campaignState.active=true;campaignState.hero=hero;campaignState.chapter=campaignProgress(hero);campaignState.approach='assault';campaignState.ending=false;runMode='campaign';matchMode='cpu';if(campaignState.chapter>=CAMPAIGN_LENGTH)campaignShowEnding();else campaignShowChapter()}
function campaignEnterFight(){if(campaignState.ending){campaignState.chapter=0;campaignState.ending=false;campaignShowChapter();return}if(!campaignState.active)return;initAudio();const mission=storyMission(),ch=campaignState.chapter;runMode='campaign';matchMode='cpu';challengeDifficulty=$('difficulty').value;selected[0]=campaignState.hero;selected[1]=mission[0];arenaIndex=mission[1];stage=ch;round=1;score=[0,0];tournamentCleared=false;resetRound();show('campaignScreen',false);show('selectScreen',false);show('resultScreen',false);show('pauseScreen',false);show('hud',true);show('fightStrip',true);show('bossMeter',false);gameMode='intro';updateRunHUD();announce('ГЛАВА '+(ch+1),'ИСТОРИЯ: '+mission[2],126);tone(320,.16);setStoryText('storyFightBtn','⚔ НАЧАТЬ ГЛАВУ')}
function campaignResetChapter(){if(!campaignState.active)return;campaignState.chapter=0;campaignState.ending=false;campaignShowChapter()}
function campaignExit(){campaignState.active=false;campaignState.ending=false;show('campaignScreen',false);if($('matchMode').value==='campaign')$('matchMode').value='campaign';menu();refreshCampaignRecords()}

for(const b of document.querySelectorAll('.campaign-choice'))b.addEventListener('click',()=>campaignSelectApproach(b.dataset.approach));
$('storyFightBtn').addEventListener('click',campaignEnterFight);
$('storyBackBtn').addEventListener('click',campaignExit);
$('storyRestartBtn').addEventListener('click',()=>campaignState.ending?campaignExit():campaignResetChapter());

const baseStoryStart=startGame;
startGame=function(){if($('matchMode').value==='campaign'){if(typeof netGuest==='function'&&netGuest()){showOnlinePanel();return}openCampaign(selected[0]);return}campaignState.active=false;show('campaignScreen',false);baseStoryStart()};
const baseStoryReset=resetRound;
resetRound=function(){baseStoryReset();if(!campaignState.active||runMode!=='campaign'||!players.length)return;const mission=storyMission();if(campaignState.approach==='assault'){players[0].energy=88;players[0].f={...players[0].f,pow:players[0].f.pow*1.11}}else{players[0].hp=125;players[0].energy=55;players[0].f={...players[0].f,pow:players[0].f.pow*.98}}players[1].hp=100+campaignState.chapter*4+(campaignState.chapter===CAMPAIGN_LENGTH-1?17:0);players[1].energy=43+campaignState.chapter*5;players[1].f={...players[1].f,pow:players[1].f.pow*(1+campaignState.chapter*.034)};updateHUD()};
const baseStoryRunHUD=updateRunHUD;
updateRunHUD=function(){baseStoryRunHUD();if(campaignState.active&&runMode==='campaign'){$('modeLabel').textContent='📜 '+fighters[campaignState.hero].name+' · КАМПАНИЯ';$('fightStatus').textContent='ГЛАВА '+(campaignState.chapter+1)+' / '+CAMPAIGN_LENGTH}};
const baseStorySettle=settleRound;
settleRound=function(winner){if(!campaignState.active||runMode!=='campaign'){baseStorySettle(winner);return}score[winner]++;tone(395,.30,'triangle',.07);updateHUD();if(score[winner]<2){round++;resetRound();return}const victory=winner===0,hero=campaignState.hero,mission=storyMission();gameMode='result';show('resultScreen',true);show('announcement',false);show('combo',false);show('toast',false);$('progressPanel').classList.add('active');$('progressTitle').textContent='📜 '+fighters[hero].name+' • ГЛАВА '+(campaignState.chapter+1)+' / '+CAMPAIGN_LENGTH;if(victory){saveCampaignProgress(hero,campaignState.chapter+1);let last=campaignState.chapter===CAMPAIGN_LENGTH-1;$('resultTitle').textContent=last?'♛ ИСТОРИЯ ЗАВЕРШЕНА!':'ГЛАВА ПРОЙДЕНА!';$('resultSub').textContent=mission[4]+(last?' Финал истории ждёт тебя.':'');$('againBtn').textContent=last?'★ СМОТРЕТЬ ФИНАЛ':'▶ СЛЕДУЮЩАЯ ГЛАВА';campaignState.chapter++;if(last){campaignState.ending=true;safeSet('wins',+safeGet('wins')+1)}}else{$('resultTitle').textContent='ПОРАЖЕНИЕ';$('resultSub').textContent='Попытка не удалась. '+fighters[mission[0]].name+' пока сильнее. Попробуй другую тактику, используй блок и парирование.';$('againBtn').textContent='↻ ПОВТОРИТЬ ГЛАВУ'}$('ladder').replaceChildren();for(let i=0;i<CAMPAIGN_LENGTH;i++){let sp=document.createElement('span');sp.textContent=i<campaignProgress(hero)?'✓':String(i+1);if(i<campaignProgress(hero))sp.className='cleared';else if(i===campaignState.chapter)sp.className='now';$('ladder').append(sp)}refreshCampaignRecords()};
const baseStoryNext=startNextFight;
startNextFight=function(){if(!campaignState.active||runMode!=='campaign'){baseStoryNext();return}if(campaignState.chapter>=CAMPAIGN_LENGTH){campaignShowEnding();return}campaignShowChapter()};
const baseStoryMenu=menu;
menu=function(){campaignState.active=false;campaignState.ending=false;show('campaignScreen',false);baseStoryMenu()};
// Buttons assigned by the base game and later by the online module; reconnect to story-aware methods.
$('startBtn').onclick=()=>startGame();
$('againBtn').onclick=()=>startNextFight();
$('backBtn').onclick=()=>menu();
$('toMenuBtn').onclick=()=>menu();
refreshCampaignRecords();
