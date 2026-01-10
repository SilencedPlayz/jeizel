const Manifest = async () => {
  const PATH = "./letters.json"
  try {
    const result = await fetch(PATH)
    const json = await result.json()
    return json;
  } catch(e) {
    console.log(e)
  }
}

const formatDate = (arr)=>{
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  const [M,D,Y] = arr;
  const selMonth = monthNames[M - 1]
  const format = {
    m: M < 10 ? "0"+M : M,
    d: D < 10 ? "0"+D : D,
    y: Y
  }
  const str = {
    format: format,
    num: `${format.m}/${format.d}/${format.y}`,
    ltr: `${selMonth} ${D}, ${Y}`
  }
  return str;
}

const formatTime = (arr)=>{
  const [h,m,isAM] = arr;
  let format = {
    h: h < 10 ? "0"+h : h,
    m: m < 10 ? "0"+m : m,
    meridiem: isAM ? "AM" : "PM",
  }
  format.format = `${format.h}:${format.m} ${format.meridiem}`
  return format;
}
const time24 = (time) =>{
  const [h,m,isAm] = time;
  let result = isAm ? `${formatTime(time).h}${formatTime(time).m}` : `${12 + h}${formatTime(time).m}`
  return result;
}

async function sortLetters(func){
  const mn = await Manifest()
  const letters = mn.letters
  
  let newTxt = []
  
  for(const letter of letters){
    const {text,date,time} = letter;
    const strDate = `${formatDate(date).format.y}${formatDate(date).format.m}${formatDate(date).format.d}`
    const strTime = time24(time)
    const formatCom = `${strDate}${strTime}`
    
    newTxt.push({text: text, dateStr: formatDate(date).ltr, dateNum: formatDate(date).num, time: formatTime(time).format, dt: parseInt(formatCom)})
  }
  
  const sortTxt = newTxt.sort((a,b)=> b.dt - a.dt)
  func(sortTxt)
}

sortLetters((letters)=>{
  letters.forEach(letter => {
    const {text,dateStr,dateNum,time} = letter;
    
    const card = document.createElement("p")
    card.id = "card"
    const dtCont = `${dateNum} • ${time}`
    card.innerHTML = `<span id="dt">${dtCont}</span>${text}`
    document.getElementById("letters").appendChild(card)
  })
})