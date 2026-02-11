console.log('=== Script cargado ===');
// ===== TRADUCCIONES - AJUSTE PARA EL IDIOMA CORRECTO =====
var MENSAGENS = {
    nomeInvalido: 'Por favor, introduce tu nombre completo',
    telefoneInvalido: 'Por favor, introduce un teléfono válido',
    enviando: 'Enviando...',
    botaoEnviar: 'ENVIAR', // Texto original del botón
    erro: 'Error',
    erroEnvio: 'Error al enviar'
};
// =====================================================
function processSubmit(form) {
    console.log('📝 Procesando envío!');

    var nameInput = form.querySelector('[name="name"]');
    var phoneInput = form.querySelector('[name="phone"]');

    var name = nameInput ? nameInput.value.trim() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';

    console.log('Nombre:', name);
    console.log('Teléfono:', phone);

    if (!name || name.length < 2) {
        alert(MENSAGENS.nomeInvalido);
        return;
    }

    if (!phone || phone.length < 8) {
        alert(MENSAGENS.telefoneInvalido);
        return;
    }

    console.log('✅ Validación OK!');

    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.textContent = MENSAGENS.enviando;
    }

    var formData = {};
    var inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function (input) {
        if (input.name && input.value) {
            formData[input.name] = input.value;
        }
    });

    var urlParams = new URLSearchParams(window.location.search);
    ['gclid', 'web_id', 'sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'utm_source', 'utm_medium', 'utm_campaign'].forEach(function (param) {
        var val = urlParams.get(param);
        if (val) formData[param] = val;
    });

    if (formData.gclid && !formData.sub1) {
        formData.sub1 = formData.gclid;
    }

    console.log('📤 Enviando a la API:', formData);

    fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(function (response) {
            console.log('📡 Respuesta recibida! Estado:', response.status);
            if (!response.ok) {
                return response.text().then(function (text) {
                    throw new Error('HTTP ' + response.status + ': ' + text);
                });
            }
            return response.json();
        })
        .then(function (data) {
            console.log('✅ Respuesta de la API:', data);
            if (data.success) {
                console.log('🎉 ¡Éxito! Redirigiendo...');
                window.location.href = '/?status=success';
            } else {
                alert(MENSAGENS.erro + ': ' + (data.error || 'Unknown error'));
                if (btn) {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                    btn.textContent = MENSAGENS.botaoEnviar;
                }
            }
        })
        .catch(function (error) {
            console.error('❌ Error:', error);
            alert(MENSAGENS.erroEnvio + ': ' + error.message);
            if (btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.textContent = MENSAGENS.botaoEnviar;
            }
        });
}
function initForm() {
    console.log('🔧 Iniciando configuración...');

    var forms = document.querySelectorAll('form');
    console.log('📋 Encontrados ' + forms.length + ' formularios');

    if (forms.length === 0) {
        console.warn('⚠️ Ningún formulario encontrado aún. Intentando de nuevo...');
        setTimeout(initForm, 500);
        return;
    }

    forms.forEach(function (form, index) {
        console.log('⚙️ Configurando formulario #' + index);

        form.addEventListener('submit', function (e) {
            console.log('🎯 Submit event capturado!');
            e.preventDefault();
            e.stopImmediatePropagation();
            processSubmit(form);
        }, true);

        var buttons = form.querySelectorAll('button[type="submit"]');
        buttons.forEach(function (btn) {
            console.log('🔘 Añadiendo listener en el botón');
            btn.addEventListener('click', function (e) {
                console.log('🖱️ Botón clicado!');
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                processSubmit(form);
            }, true);
        });
    });

    console.log('✅ Configuración concluida!');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
} else {
    initForm();
}
window.addEventListener('load', function () {
    console.log('🌐 Window.load disparado...');
    setTimeout(initForm, 100);
});
