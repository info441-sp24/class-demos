async function checkTime(){
    let response = await fetch("/api/getTime")
    let responseText = await response.text()

    document.getElementById("results").innerHTML = responseText
}