function procurar(){
    fetch('https://cors-anywhere.herokuapp.com/https://monitor-callcenter.go.akamai-access.com/acompanhamento')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('title').textContent;
      console.log(title);
    })
    .catch(error => console.error(error));
}