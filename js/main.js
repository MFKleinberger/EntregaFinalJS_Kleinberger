let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCantidad(input, producto, incremento) {
    let cantidadActual = parseInt(input.value) || 0;
    cantidadActual += incremento ? 1 : -1;
    if (cantidadActual < 0) cantidadActual = 0;
    input.value = cantidadActual;
    actualizarCarrito(producto, cantidadActual);
}

function actualizarCarrito(producto, cantidad) {
    let productoExiste = carrito.some((item) => {
        if (item.id === producto.id) {
            if (cantidad > 0) {
                item.cantidad = cantidad;
            } else {
                carrito = carrito.filter(p => p.id !== producto.id);
            }
            return true;
        }
        return false;
    });

    if (!productoExiste && cantidad > 0) {
        carrito.push({ ...producto, cantidad });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarTotalCarbohidratos();
}

function actualizarTotalCarbohidratos() {
    const totalCarbos = carrito.reduce((acc, item) => acc + item.carbos * item.cantidad, 0);
    document.getElementById("total-carbohidratos").innerText = `Carbo/h: ${totalCarbos} gr`;
}

function limpiarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'No, mantener',
        reverseButtons: true,
        customClass: {
            title: 'swal2-title',
            content: 'swal2-content',
            confirmButton: 'swal2-styled',
            cancelButton: 'swal2-styled'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            localStorage.removeItem("carrito");
            actualizarTotalCarbohidratos();

            const inputs = [...document.getElementsByClassName('cantidad-input')];
            inputs.forEach(input => input.value = 0);

            Swal.fire(
                '¡Carrito limpio!',
                'Tu carrito ha sido vaciado.',
                'success'
            );
        }
    });
}

function mostrarCarrito() {
    let mensaje = '';
    carrito.forEach(({ nombre, um, cantidad, carbos }) => {
        mensaje += `${cantidad} x ${nombre} (${um}) : ${carbos * cantidad} gr<br>`;
    });
    const totalCarbos = carrito.reduce((acc, item) => acc + item.carbos * item.cantidad, 0);
    mensaje += `<br><strong>Total de Carbohidratos: ${totalCarbos} gr<strong>`;

    Swal.fire({
        title: 'Carbohidratos para una hora de Trail-Running',
        html: mensaje || "El carrito está vacío.",
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
            popup: 'swal-carrito',
            confirmButtonText: 'swal2-styled'
        }
    });
}

function cargarCantidadesDesdeLocalStorage() {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoGuardado.forEach(item => {
        const inputCantidad = document.getElementById(`cantidad-${item.id}`);
        
        if (inputCantidad) {
            inputCantidad.value = item.cantidad;
        }
    });
}

function crearBarraCarrito() {
    const containerCarrito = document.getElementById("container-carrito");

    const barra = document.createElement("div");
    barra.id = "barra-carrito";

    const totalCarbohidratos = document.createElement("span");
    totalCarbohidratos.id = "total-carbohidratos";
    const totalCarbosGuardado = carrito.reduce((acc, item) => acc + item.carbos * item.cantidad, 0);
    totalCarbohidratos.innerText = `Carbo/h: ${totalCarbosGuardado} gr`;    

    const botonLimpiar = document.createElement("button");
    botonLimpiar.id = "boton-limpiar";
    botonLimpiar.innerText = "Limpiar";
    botonLimpiar.onclick = limpiarCarrito;

    const botonMostrar = document.createElement("button");
    botonMostrar.id = "boton-mostrar";
    botonMostrar.innerText = "Resumen";
    botonMostrar.onclick = mostrarCarrito;

    barra.append(totalCarbohidratos);
    barra.append(botonMostrar);
    barra.append(botonLimpiar);

    containerCarrito.append(barra);
}

function crearCard(producto) {
    const card = document.createElement("div");
    card.className = "card col-md-4 mb-4";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.innerText = producto.nombre;

    const imagen = document.createElement("img");
    imagen.src = producto.img;
    imagen.className = "imgCard img-fluid";

    const carbos = document.createElement("p");
    carbos.className = "card-text carbos";
    carbos.innerText = `CarboHidratos: ${producto.carbos} gr`;
    
    const um = document.createElement("p");
    um.className = "card-text um";
    um.innerText = `Medida: ${producto.um}`;

    const controlGroup = document.createElement("div");
    controlGroup.className = "control-group d-flex align-items-center";
    
    const botonMas = document.createElement("button");
    botonMas.className = "btn btn-success mr-2";
    botonMas.innerText = " + ";
    botonMas.onclick = () => actualizarCantidad(cantidad, producto, true);

    const cantidad = document.createElement("input");
    cantidad.className = "form-control text-center cantidad-input";
    cantidad.type = "text";
    cantidad.value = 0;
    cantidad.id = `cantidad-${producto.id}`;

    const botonMenos = document.createElement("button");
    botonMenos.className = "btn btn-danger ml-2";
    botonMenos.innerText = " - ";
    botonMenos.onclick = () => actualizarCantidad(cantidad, producto, false);

    const cantidadGuardada = carrito.find(item => item.id === producto.id);
    if (cantidadGuardada) {
        cantidad.value = cantidadGuardada.cantidad;
    }

    controlGroup.append(botonMenos);
    controlGroup.append(cantidad);
    controlGroup.append(botonMas);

    cardBody.append(titulo);
    cardBody.append(imagen);
    cardBody.append(carbos);
    cardBody.append(um);
    cardBody.append(controlGroup);

    card.append(cardBody);

    document.getElementById("alimentosContainer").append(card);
};

const header = document.getElementById("mi-header");
const titulo = document.createElement("h1");
const subTitulo = document.createElement("h2")
titulo.innerText = "Trail Running";
subTitulo.innerText = "Calculadora de Carbohidratos";

const parrafo = document.createElement("p");
parrafo.innerText = "Agregá alimentos para 1(una) hora de carrera\n(Se recomienda 70 a 90 gramos de carbohidratos).";

header.append(titulo);
header.append(subTitulo);
header.append(parrafo);

crearBarraCarrito();

const subirLink = document.createElement('a');
subirLink.href = '#';
subirLink.className = 'subir';

const subirIcon = document.createElement('i');
subirIcon.className = 'fa-solid fa-chevron-up';
subirLink.append(subirIcon);
document.body.append(subirLink);

const whatsappLink = document.createElement('a');
whatsappLink.href = 'https://walink.co/e7f175';
whatsappLink.className = 'whatsapp';
whatsappLink.target = '_blank';

const whatsappIcon = document.createElement('i');
whatsappIcon.className = 'fa-brands fa-whatsapp';
whatsappLink.append(whatsappIcon);
document.body.append(whatsappLink);

// cafecito inicia
const cafecitoLink = document.createElement('a');
cafecitoLink.href = 'https://cafecito.app/kaeme1';
cafecitoLink.className = 'cafecito';
cafecitoLink.target = '_blank';

const cafecitoIcon = document.createElement('i');
cafecitoIcon.className = 'fa-solid fa-mug-hot';
cafecitoLink.append(cafecitoIcon);
document.body.append(cafecitoLink);
// cafecito inicia

fetch('./data.json')
    .then(response =>response.json())
    .then(alimentos => {
        alimentosContainer.innerHTML = `<div class="loader"></div>`;

        setTimeout(() => {
            alimentosContainer.innerHTML = '';
            alimentos.forEach(el => crearCard(el));
        }, 1000);
    });

// productos a agregar: banana, aceitunas, twistos, queso, mogul, LISTO
// SEO: poner en los encabezados los hashtag y la descripción. Ver peso de imágenes.
// Mejora: Fijar la barra para que cuando se baje se pueda ir viendo el acumulado sin tener que subir cada vez.
// Mejora: compatibilidad con iphone
// version 2 (acumnular horas): la idea es que cuando tenés 1 hora ya cerrada, tengas un botón en el sweet alert para "agregar al plan de carrera". Al hacer esto, al final de la página se crea una sección de "plan de carrera" con una tabla que tiene las horas como filas y en la columna lateral el lsitado de alimentos. Asimismo un botón de eliminar hora con un sweet alert de confirmación. Asimismo, al agregar horas al plan, un sweet alert pregunta si desea agregar otra hora igual o limpiar el carrito y crear una hora nueva.LAs horas del plan de carrera también se guardan en local Storage. Debe haber un botón para limpiar todo el plan y así poder empezar desde 0 (con un sweet alert de confirmación). Un potón para guardar que permita bajar un pdf con el plan de horas. En la barra debería haber un navegador para ir directo al PLan de Horas del final. Agregar 
