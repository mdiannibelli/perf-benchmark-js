const $globalCode = document.getElementById('global-code');
const $sendButton = document.querySelector('.send-button');
const $bars = document.querySelectorAll('.bar');
const $percentages = document.querySelectorAll('.percentage');

//const worker = new Worker('worker.js');
//worker.postMessage({ message: "Work!!" })
//worker.onmessage = event => console.log(event)

async function runUnitaryCase({ code, data }) {
    const worker = new Worker('worker.js');
    let duration = 1000 // 1s
    worker.postMessage({ code, data, duration });

    return new Promise((resolve) => {
        worker.onmessage = event => {
            resolve(event.data)
        }
    })
}

async function runTestCases() {
    const $testCases = document.querySelectorAll('.test-case');
    const globalCode = $globalCode.value;

    $bars.forEach(bar => bar.setAttribute('height', 0))

    const promises = Array.from($testCases).map(async (testCase) => {
        const $code = testCase.querySelector('.code');
        const $ops = testCase.querySelector('.test-ops');
        $ops.textContent = 'Loading...';

        const codeValue = $code.value;
        const result = await runUnitaryCase({ code: codeValue, data: globalCode });

        $ops.textContent = `${result.toLocaleString()} ops/s`;

        return result;
    })

    const results = await Promise.all(promises);
    const maxOps = Math.max(...results);

    results.forEach((result, index) => {
        const $bar = $bars[index];
        const $percentage = $percentages[index];

        const chartHeight = 300;
        const height = result / maxOps * chartHeight;
        console.log(result)
        const percentageValue = Math.round(result / maxOps * 100);
        console.log(percentageValue)

        $bar.setAttribute('height', height);
        $percentage.textContent = `${percentageValue}%`;
    });
}

runTestCases()

$sendButton.addEventListener('click', () => {
    runTestCases();
})