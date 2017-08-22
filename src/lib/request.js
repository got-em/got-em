/*
Add event listeners like-

const req = Request('get', '/route');
req.addEventListener('load', () => {
    if (req.status !== 200) {
        console.log(`Error- ${req.response}`);
    }
});
*/

export default function request(method, path, data = null) {
    method = method.toUpperCase();

    const request = new XMLHttpRequest();
    request.open(method, path, true);
    if (method === 'POST') {
        request.setRequestHeader('Content-Type', 'application/json');
    }
    request.send(data);
    return request;
}