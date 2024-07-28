const url = 'https://api.restful-api.dev/objects';

window.addEventListener('DOMContentLoaded', () => {
    $('#popUp').hide();
    readProducts();
});
function insertRow(product) {
    var tbody = document.getElementsByTagName('tbody')[0];
    var row = tbody.insertRow();
    row.setAttribute('data-id', product.id);
    var cell = row.insertCell();
    cell.innerHTML = product.id;
    cell = row.insertCell();
    cell.innerHTML = product.name;
    cell = row.insertCell();
    cell.innerHTML = product.data?.color || 'N/A';
    cell = row.insertCell();
    cell.innerHTML = product.data?.capacity || 'N/A';
    cell = row.insertCell();
    cell.innerHTML = product.data?.price || 'N/A';
    cell = row.insertCell();
    cell.innerHTML = `
        <button onclick='viewProduct(${JSON.stringify(product)})'>Ver</button>
        <button onclick='deleteProduct(${JSON.stringify(product.id)})'>Eliminar</button>
    `;
    clearInputs()
}


function readProducts() {
    get().then(response => {
        console.log('Productos leídos:', response); 
        var tbody = document.getElementsByTagName('tbody')[0];
        while (tbody.rows.length > 1) {
            tbody.deleteRow(1);
        }
        response.forEach(e => {
            insertRow(e);
        });
    }).catch(error => {
        console.error('Error al leer productos:', error);
    });
}

function createProduct() {
    add().then(response => {
        console.log('Producto agregado:', response); 
        insertRow(response);
       
    }).catch(error => {
        console.error('Error al agregar producto:', error); 
    });
}

function deleteProduct(id) {
    remove(id).then(() => {
        console.log('Producto eliminado:', id); 
        removeRow(id) 
    }).catch(error => {
        console.error('Error al eliminar producto:', error);
    });
}

function viewProduct(product) {
    updateModalFields(product)
    $('#popUp').dialog({
        closeText: ''
    }).css('font-size', '13px');
}
function updateModalFields(product) {
    document.getElementsByName('id2')[0].value = product.id;
    document.getElementsByName('name2')[0].value= product.name;
    document.getElementsByName('color2')[0].value = product.data?.color || '';
    document.getElementsByName('capacity2')[0].value = product.data?.capacity || '';
    document.getElementsByName('price2')[0].value = product.data?.price || '';
}


function removeRow(id) {
    var tbody = document.getElementsByTagName('tbody')[0];
    var rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].getAttribute('data-id') === id.toString()) {
            tbody.deleteRow(i);
            break;
        }
    }
}
// PROMESAS

function get() {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'json';
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(request.statusText);
            }
        };
        request.onerror = () => {
            reject(request.responseText);
        };
        request.send();
    });
}

function add() {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('POST', url);
        request.setRequestHeader('Content-Type', 'application/json');
        var dat= {
            'color':document.getElementById('color').value,
            'capacity': document.getElementById('capacity').value,
            'price': document.getElementById('price').value

        }
        var product = {
            'name': document.getElementById('name').value,
            'data' : dat
        };
        console.log('Agregando producto:', product); // Log del producto que se va a agregar
        request.onload = () => {
            if (request.status === 201 || request.status === 200) {
                resolve(JSON.parse(request.responseText));
            } else {
                console.error('Estado de la respuesta:', request.status); // Estado de la respuesta en caso de error
                console.error('Respuesta del servidor:', request.responseText); // Respuesta del servidor en caso de error
                reject(`Error: ${request.status} ${request.statusText}`);
            }
        };
        request.onerror = () => {
            reject(request.responseText);
        };
        request.send(JSON.stringify(product));
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('DELETE', `${url}/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = () => {
            if (request.status === 204 || request.status === 200) {
                resolve(request.response);
            } else {
                console.error('Estado de la respuesta:', request.status); // Estado de la respuesta en caso de error
                console.error('Respuesta del servidor:', request.responseText); // Respuesta del servidor en caso de error
                reject(`Error: ${request.status} ${request.statusText}`);
            }
        };
        request.onerror = () => {
            reject(request.responseText);
        };
        request.send();
    });
}

function update(id, product) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('PUT', `${url}/${document.getElementsByName('id2')[0].value}`);
        request.setRequestHeader('Content-Type', 'application/json');
        var product = {
            'name': document.getElementsByName('name2')[0].value,
            'data': {
                'color': document.getElementsByName('color2')[0].value,
                'capacity': document.getElementsByName('capacity2')[0].value,
                'price': document.getElementsByName('price2').value || null
            }
        }
        console.log('Actualizando producto:', product); // Log del producto que se va a actualizar
        request.onload = () => {
            if (request.status === 200) {
                resolve(JSON.parse(request.responseText));
            } else {
                reject(request.statusText);
            }
        };
        request.onerror = () => {
            reject(request.responseText);
        };
        request.send(JSON.stringify(product));
    });
}
//
function clearInputs() {
    document.getElementById('name').value = ''
    document.getElementById('color').value = ''
    document.getElementById('capacity').value= ''
    document.getElementById('price').value = ''
    document.getElementById('name').focus()
}
function refreshProduct(id, product) {
    var row = document.querySelector(`tr[data-id='${id}']`);
    if (row) {
        row.cells[1].innerHTML = product.name;
        row.cells[2].innerHTML = product.data.color || 'N/A';
        row.cells[3].innerHTML = product.data.capacity || 'N/A';
        row.cells[4].innerHTML = product.data.price || 'N/A';
    }
}
function updateProduct() {
    if (document.getElementsByName('name2')[0].value.trim() !== '' &&
        document.getElementsByName('color2')[0].value.trim() !== '' &&
        document.getElementsByName('capacity2')[0].value.trim() !== '' &&
        document.getElementsByName('price2')[0].value.trim() !== '') {

        var id = document.getElementsByName('id2')[0].value;
        var name = document.getElementsByName('name2')[0].value;
        var color = document.getElementsByName('color2')[0].value;
        var capacity = document.getElementsByName('capacity2')[0].value;
        var price = document.getElementsByName('price2')[0].value;

        var product = {
            'id': id,
            'name': name,
            'data': {
                'color': color,
                'capacity': capacity,
                'price': price
            }
        };

        update(id, product).then(() => {
            var rows = document.querySelectorAll('tr');
            rows.forEach(row => {
                if (row.getAttribute('data-id') === id) {
                    row.cells[1].innerHTML = name;
                    row.cells[2].innerHTML = color;
                    row.cells[3].innerHTML = capacity;
                    row.cells[4].innerHTML = price;
                    row.cells[5].innerHTML = `
                        <button onclick='viewProduct(${JSON.stringify({id, name, data: {color, capacity, price}})})'>Ver</button>
                        <button onclick='deleteProduct(${JSON.stringify(product.id)})'>Eliminar</button>
                    `;
                }
            });
            $('#popUp').dialog('close');
            clearInputs();
        }).catch(error => {
            console.error('Error al actualizar producto:', error);
        });
    } else {
        console.error('Todos los campos deben estar llenos.');
    }
}

