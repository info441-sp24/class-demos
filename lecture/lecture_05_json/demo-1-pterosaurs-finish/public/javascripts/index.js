async function getPterosaurs(){
    let response = await fetch("api/getPterosaurs")
    let PterosaurJson = await response.json()

    PterosaurHtml = PterosaurJson.map(onePterosaur => {
        return `
        <div>
            <p>${onePterosaur.Genus}</p>
            <img src="${onePterosaur.img}" />
        </div>
        `
    }).join("")

    document.getElementById("results").innerHTML = PterosaurHtml
}