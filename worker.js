// It will be executed outside the main thread

onmessage = async event => {
    //console.log(event.data);
    //postMessage('hello from worker');
    const { code, data, duration } = event.data;
    let result;
    try {
        result = await eval(`(async() => {
            ${data};
            let __ops = 0;
            let __start = Date.now();
            let __end = Date.now() + ${duration};
            while(Date.now() < __end) {
                ${code};
                __ops++;
            }
            return __ops;
            })()`);
    } catch (error) {
        /* console.log(error) */
        result = 0;
    }
    postMessage(result);
}