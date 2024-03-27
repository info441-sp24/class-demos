function pauseForNSeconds(n){
    return new Promise(resolve => {
        setTimeout(() => {resolve("finish")}, 1000*n)
    })
}

async function testAwait(){
    console.log("testAwait is about to wait")
    await pauseForNSeconds(5);
    console.log("testAwait finished the 5 second wait")
}

testAwait()

async function testAwait2(){
    console.log("testawait2 is about to wait")
    await pauseForNSeconds(3)
    console.log("testawait2 finished the 3 second wait")
}

testAwait2()
