import http from 'k6/http';
import { sleep } from 'k6';

// Load Testing Microservice
// https://k6.io/docs/getting-started/running-k6/
const endpoints = [
    'https://blog-zombie-blog-microservice-dot-jamm-software-systems.uk.r.appspot.com/',
    'https://blog-zombie-blog-microservice-dot-jamm-software-systems.uk.r.appspot.com/blogs',
    'https://blog-zombie-blog-microservice-dot-jamm-software-systems.uk.r.appspot.com/blogs/60cc1c6c5fdf74150030f0f3',
    'https://blog-zombie-blog-microservice-dot-jamm-software-systems.uk.r.appspot.com/blogs/60cc1c6c5fdf74150030',
];

const aBlogPost = JSON.stringify({
    "_id_author": "_test_",
    "_id_publication": "_test_",
    "title": "_test_ Title _test_",
    "author": "_test_ Author _test_",
    "published": "_test_ Date _test_",
    "body": "_test_ Body _test_"
});

/*export let options = {
  vus: 10,
  duration: '15s',
};*/

export let options = {
  vus: 1,
  duration: '1s',
};

var only400Callback = http.expectedStatuses(400);

export default function () {

    var rand = Math.random();
    let headers = { "Content-Type": "application/json"}

    if(rand <= 0.5) {
        http.get(endpoints[0]);
    }
    else if(rand > 0.5 && rand <= 0.7){
        http.post(endpoints[1], JSON.stringify(http.post(endpoints[1], aBlogPost, { headers: headers })))
    } else if(rand > 0.7 && rand <= 0.9){
        http.get(endpoints[1])
    } else if(rand > 0.9 && rand <= 0.95) {
        http.get(endpoints[2])
    } else {
        http.get(endpoints[3], {responseCallback: only400Callback})
    }
    sleep(1);
}

export function handleSummary(data) {
    console.log('Preparing the end-of-test summary...');

    return {
        './load_test_results.json': JSON.stringify(data) 
    }
}