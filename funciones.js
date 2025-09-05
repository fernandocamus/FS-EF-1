// VALIDACION FORMATO CORREO
function validacionCorreo(correo) {
    var va_correo = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return va_correo.test(correo);
}

// VALIDACION VACIO
function validacionVacio(campo) {
    return campo.val().trim() !== "";
}

// VALIDACION @duoc.cl
function correoEsDuoc(correo) {
    return /@duoc\.cl$/i.test(correo);
}

// VALIDACION NOMBRE: LETRAS, 50 CARACTERES MAX
function validacionNombre(nombreStr) {
    var va_caracteres = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,50}$/;
    return va_caracteres.test(nombreStr);
}

// VALIDACION CONTRASEÑA: >=8, 1 MAYUSCULA, 1 MINUSCULA, 1 NUMERO y 1 CARACTER ESPECIAL
function validacionPassword(password) {
    var va_caracteres = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return va_caracteres.test(password);
}

// VALIDACION TELEFONO: SOLO DIGITOS, LARGO 8 a 15
function validacionTelefono(telefonoTex) {
    if (telefonoTex.trim() === "") return true; // opcional
    return /^\d{8,15}$/.test(telefonoTex);
}

// VALIDACION CORREO UNICO (true si es unico)
function esCorreoUnico(correo) {
    var lista = JSON.parse(localStorage.getItem("correosRegistrados") || "[]");
    return !lista.includes(correo.toLowerCase());
}

// GUARDAR USUARIO EN LOCALSTORAGE
function guardarUsuarioEnLocalStorage(nombre, correo, password, telefono) {
    var lista = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    lista.push({nombre, correo: correo.toLowerCase(), password, telefono});
    localStorage.setItem("usuariosRegistrados", JSON.stringify(lista));
}

// CAMBIAR USUARIO EN LOCALSTORAGE
function cambiarUsuarioEnLocalStorage(correo, password) {
    var lista = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    var usuario = null;
    for(var i = 0; i < lista.length; i++) {
        if (lista[i]?.correo === correo.toLowerCase()) {
            usuario = lista[i];
            lista[i].password = password;
            break;
        }
    }
    if (usuario) {
        localStorage.setItem("usuariosRegistrados", JSON.stringify(lista));
        return true;
    } else {
        return false;
    }
}

// VALIDACION REGISTRO
function validacionRegistro() {
    $("#resultado").empty();

    var nombre = $("#nombre");
    var correo = $("#correo");
    var password = $("#password");
    var confirmPassword = $("#confirmPassword");
    var telefono = $("#telefono");

    // ARRAYS PARA ERRORES Y VACIONS
    var camposVacios = [];
    var textoErrores = [];

    //VALIDAR QUE NO SEA VACIO
    if (!validacionVacio(nombre)) camposVacios.push("Nombre completo");
    if (!validacionVacio(correo)) camposVacios.push("Correo electrónico");
    if (!validacionVacio(password)) camposVacios.push("Contraseña");
    if (!validacionVacio(confirmPassword)) camposVacios.push("Confirmación de contraseña");

    // VALIDACIONES ESPECIFICAS
    if (validacionVacio(nombre) && !validacionNombre(nombre.val().trim()))
        textoErrores.push("El nombre debe contener solo letras y espacios (máx 50 caracteres).");

    if (validacionVacio(correo)) {
        var correoVal = correo.val().trim();
        if (!validacionCorreo(correoVal)) textoErrores.push("El formato del correo no es válido.");
        else if (!correoEsDuoc(correoVal)) textoErrores.push("El correo debe pertenecer al dominio @duoc.cl.");
        else if (!esCorreoUnico(correoVal)) textoErrores.push("El correo ya está registrado en el sistema.");
    }

    if (validacionVacio(password) && !validacionPassword(password.val()))
        textoErrores.push("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.");

    if (validacionVacio(password) && validacionVacio(confirmPassword) && password.val() !== confirmPassword.val())
        textoErrores.push("Las contraseñas no coinciden.");

    if (!validacionTelefono(telefono.val())) textoErrores.push("El teléfono debe contener solo números (8-15 dígitos).");

    if (camposVacios.length || textoErrores.length) {
        var mensajeError = "<div class='alert alert-danger'>";
        if (camposVacios.length) mensajeError += "<strong>Campos vacíos:</strong><br>• " + camposVacios.join("<br>• ") + "<br>";
        if (textoErrores.length) mensajeError += "<strong>Errores de formato:</strong><br>• " + textoErrores.join("<br>• ");
        mensajeError += "</div>";
        $("#resultado").html(mensajeError);
    } else {
        guardarUsuarioEnLocalStorage(nombre.val().trim(), correo.val().trim(), password.val(), telefono.val().trim());
        $("#resultado").html("<div class='alert alert-success'><strong>¡Perfecto!</strong> Registro completado correctamente.</div>");
        $("#formRegistro")[0].reset();
    }

    return false;
}

function validacionCambioPassword() {
    $("#resultado").empty();

    var correo = $("#correo")
    var password = $("#password")
    var confirmPassword = $("#confirmPassword")

    //ARRAYS PARA ERRORES Y VACIOS
    var camposVacios = [];
    var textoErrores = [];

    //VALIDAR QUE NO SEA VACIO
    if (!validacionVacio(correo)) camposVacios.push("Correo electrónico");
    if (!validacionVacio(password)) camposVacios.push("Contraseña");
    if (!validacionVacio(confirmPassword)) camposVacios.push("Confirmación de contraseña");

    // VALIDACIONES ESPECIFICAS
    if (validacionVacio(correo)) {
        var correoVal = correo.val().trim();
        if (!validacionCorreo(correoVal)) textoErrores.push("El formato del correo no es válido.");
        else if (!correoEsDuoc(correoVal)) textoErrores.push("El correo debe pertenecer al dominio @duoc.cl.");
        else if (!esCorreoUnico(correoVal)) textoErrores.push("El correo ya está registrado en el sistema.");
    }

    if (validacionVacio(password) && !validacionPassword(password.val()))
        textoErrores.push("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial.");

    if (validacionVacio(password) && validacionVacio(confirmPassword) && password.val() !== confirmPassword.val())
        textoErrores.push("Las contraseñas no coinciden.");

    if (camposVacios.length || textoErrores.length) {
        var mensajeError = "<div class='alert alert-danger'>";
        if (camposVacios.length) mensajeError += "<strong>Campos vacíos:</strong><br>• " + camposVacios.join("<br>• ") + "<br>";
        if (textoErrores.length) mensajeError += "<strong>Errores de formato:</strong><br>• " + textoErrores.join("<br>• ");
        mensajeError += "</div>";
        $("#resultado").html(mensajeError);
    } else {
        cambiarUsuarioEnLocalStorage(correo.val().trim(), password.val());
        $("#resultado").html("<div class='alert alert-success'> Cambio de contraseña completado correctamente.</div>");
        $("#formRegistro")[0].reset();
    }

    return false;
}

// login
function iniciarSesion(correo, password) {
    var lista = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    var usuario = null;
    for(var i = 0; i < lista.length; i++) {
        if (lista[i].correo === correo.toLowerCase() && lista[i].password === password) {
            usuario = lista[i];
            break;
        }
    }
    if (usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
        return true;
    } else {
        return false;
    }
}

// PERFIL E INFORMACION
function mostrarUsuarioNav() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
    const menu = $("#userMenu + .dropdown-menu");

    if (usuario) {
        // USUARIO LOGUEADO
        menu.html(
            `<li><strong>${usuario.nombre}</strong></li>
             <li><span class='text-muted'>${usuario.correo}</span></li>
             <li><hr class='dropdown-divider'></li>
             <li><a class='dropdown-item text-primary' href='passchange.html'>Cambiar contraseña</a></li>
             <li><a class='dropdown-item text-danger' href='#' id='cerrarSesion'>Cerrar sesión</a></li>`
        );
        $("#cerrarSesion").click(function() {
            localStorage.removeItem("usuarioActivo");
            location.href = "login.html";
        });
    } else {
        // Invitado
        menu.html(
            `<li><strong>Invitado</strong></li>
             <li class='text-muted'>No has iniciado sesión</li>
             <li><hr class='dropdown-divider'></li>`
        );
    }
    $(".nav-item.dropdown").show(); // Siempre visible
}

// BOTONES
mostrarUsuarioNav();

// REGISTRO
$("#btnRegistrar").click(validacionRegistro);

// LOGIN
$("#btnLogin").click(function() {
    var correo = $("#correo").val().trim();
    var password = $("#password").val();
    if (iniciarSesion(correo, password)) {
        location.href = "index.html";
    } else {
        $("#loginResultado").html("<div class='alert alert-danger'>Correo o contraseña incorrectos.</div>");
    }
});

// CAMBIAR CONTRASEÑA
$("#btnCambiarPass").click(validacionCambioPassword);