const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    const tableevents = document.getElementById("tableevents");
    const tablecorrelation = document.getElementById("tablecorrelation");
    let allEvents = [];
    Object.keys(res).forEach((key) => {
      allEvents.push(res[key].events);
    });
    let mergedEvents = [].concat.apply([], allEvents);
    let uniqueEvents = [...new Set(mergedEvents)];
    let TP = new Array(uniqueEvents.length).fill(0);
    let FP = new Array(uniqueEvents.length).fill(0);
    let FN = new Array(uniqueEvents.length).fill(0);
    let TN = new Array(uniqueEvents.length).fill(0);
    let MCC = new Array(uniqueEvents.length).fill(0);

    Object.keys(res).forEach((key) => {
      //Table of events
      let formatF = `<tr>
        <th>${Number(key) + 1}</th>
        <td>${res[key].events}</td>
        <td>${res[key].squirrel}</td>
      </tr>`;
      let formatT = `<tr style="background-color:#f9c4cb">
        <th>${Number(key) + 1}</th>
        <td>${res[key].events}</td>
        <td>${res[key].squirrel}</td>
      </tr>`;
      let format = res[key].squirrel === true ? formatT : formatF;
      tableevents.innerHTML += format;

      //Table of correlation events
      let j = 0;
      while (j < uniqueEvents.length) {
        // eslint-disable-next-line no-loop-func
        res[key].events.forEach((el) => {
          if (res[key].squirrel === true && uniqueEvents[j] === el) {
            TP[j]++;
          } else if (res[key].squirrel === false && uniqueEvents[j] === el) {
            FN[j]++;
          }
        });
        encontradoFP = false;
        encontradoTN = false;
        if (res[key].squirrel) {
          // eslint-disable-next-line no-loop-func
          res[key].events.forEach((el) => {
            if (uniqueEvents[j] === el) {
              encontradoFP = true;
            }
          });
          FP[j] = !encontradoFP ? FP[j] + 1 : FP[j];
        } else {
          // eslint-disable-next-line no-loop-func
          res[key].events.forEach((el) => {
            if (uniqueEvents[j] === el) {
              encontradoTN = true;
            }
          });
          TN[j] = !encontradoTN ? TN[j] + 1 : TN[j];
        }
        j++;
      }
    });

    let c = 0;
    while (c < uniqueEvents.length) {
      MCC[c] =
        (TP[c] * TN[c] - FP[c] * FN[c]) /
        Math.sqrt(
          (TP[c] + FP[c]) * (TP[c] + FN[c]) * (TN[c] + FP[c]) * (TN[c] + FN[c])
        );
      c++;
    }

    let s = 0;
    let items = [];
    while (s < uniqueEvents.length) {
      items.push({ name: uniqueEvents[s], value: MCC[s] });
      s++;
    }
    //Ordering
    items = items.sort((a, b) => {
      if (a.value > b.value) {
        return -1;
      }
      if (a.value < b.value) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
    let i = 0;
    while (i < items.length) {
      let formatC = `<tr>
            <th>${i + 1}</th>
            <td>${items[i].name}</td>
            <td>${items[i].value}</td>
        </tr>`;
      tablecorrelation.innerHTML += formatC;
      i++;
    }
  });
