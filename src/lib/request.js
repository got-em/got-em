export default function request(method, path, data = null) {
    method = method.toUpperCase();

    const request = new XMLHttpRequest();
    request.open(method, path, true);
    if (method === 'POST') {
        request.setRequestHeader('Content-Type', 'application/json');
    }
    request.send(data);
}