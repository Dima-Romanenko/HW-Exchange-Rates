(async () => {
  let select = document.querySelector(".select");
  let countryContainer = document.querySelector(".container");
  let rateName = "";
  let selectValue = "";
  let countryArray = [];
  ratesCc = [];
  // Отправка запросов, используем Promise.All чтобы принять все данные одновременно
  let COUNTRY_URL = `https://restcountries.eu/rest/v2/all`;
  let RATES_URL = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json`;

  let countryData = await fetch(COUNTRY_URL);
  let ratesData = await fetch(RATES_URL);

  let total_answers = await Promise.all([countryData, ratesData]);

  total_answers = Promise.all([
    (countryData = total_answers[0].json()),
    (ratesData = total_answers[1].json()),
  ]);
  totalData = await total_answers;
  // вытягиваем из полученых данных два массива
  countryData = totalData[0];
  ratesData = totalData[1];

  // выводим названия валют в select
  ratesData
    .map((rate) => {
      ratesCc.push(rate.cc);
      rateName = `
    <option value="${rate.cc}">${rate.cc}</option>
    `;
      select.innerHTML += rateName;
    })
    .sort((a, b) => {
      return a.cc > b.cc;
    });
  // сравниваем данные по названияь валют, те сранны с валютой которых нац.банк не работае
  // отбрасываем, далее с обьектов нац.банка вытягиваем свойства с курсом, датой и названием
  // валюты на нашем языке, и добавляем в обьект подходящих стран
  countryData.map((country) => {
    if (!ratesCc.includes(country.currencies[0].code)) {
      return "";
    } else {
      for (rate of ratesData) {
        if (rate.cc == country.currencies[0].code) {
          country.currencies[0].txt = rate.txt;
          country.currencies[0].rate = rate.rate;
          country.exchangedate = rate.exchangedate;
        }
      }
      countryArray.push(country);
    }
  });
  // Функция выводит все данные по странам в блок countryContainer
  function showAll() {
    countryArray
      .map((country) => {
        return `
      <div class="country-item">
        <img src="${country.flag}">
        <span>${country.name}(${country.currencies[0].code} - ${country.currencies[0].txt})</span>
        <i>Курс: <strong>${country.currencies[0].rate}</strong> на ${country.exchangedate}</i>
      </div>
    `;
      })
      .forEach((element) => {
        countryContainer.innerHTML += element;
      });
  }

  showAll();

  // функция фильтрует данные по названию валюты и выводит данные по странам которые пользуются
  // этой валютой
  function chooseOne(value) {
    countryArray
      .map((country) => {
        if (value != country.currencies[0].code) {
          return "";
        }
        return `
      <div class="country-item">
        <img src="${country.flag}">
        <span>${country.name}(${country.currencies[0].code} - ${country.currencies[0].txt})</span>
        <i>Курс: <strong>${country.currencies[0].rate}</strong>  на ${country.exchangedate}</i>
      </div>
    `;
      })
      .forEach((element) => {
        countryContainer.innerHTML += element;
      });
  }

  // функция ожидает событие в selecte, если событие произошло очищает все данные из блока
  // countryContainer и вызывает необходимую функцию
  select.addEventListener("change", () => {
    selectValue = select.value;
    countryContainer.innerHTML = "";

    if (selectValue == "all") {
      showAll();
    } else {
      chooseOne(selectValue);
    }
  });
})();
