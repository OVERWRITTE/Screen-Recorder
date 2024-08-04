const button = document.getElementById("recorder");
const status = document.getElementById("status");
const preview = document.getElementById("preview");

let mediaStream = null;

button.addEventListener("click", async () => {
    try {
        if (mediaStream) {
            //detiene la vista en tiempo real
            mediaStream.getTracks().forEach( track => track.stop());
            preview.srcObject = null;
            mediaStream = null;
            status.textContent = "⚫Grabacion detenida";
            button.textContent = "Iniciar grabacion";
            return;
        }

        //Pide la pantalla/ventana a grabar
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: {ideal: 30}}
        })

        //establecer la vista en tiempo real
        preview.srcObject = mediaStream;

        //actualizar estado del boton
        status.textContent = "🔴Grabando";
        button.textContent = "Detener grabacion";

        //inicializamos el media recorder
        const mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'video/webm; codecs=vp8,opus'
        }) 

        mediaRecorder.start();

        mediaRecorder.addEventListener("dataavailable", (e) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(e.data);
            link.download = "Grabacion de pantalla"
            link.click();
        })

        mediaRecorder.addEventListener("stop", () => {
            status.textContent = "⚫Grabacion detenida";
            button.textContent = "Iniciar grabacion";
        })

        //finalizar la grabacion cunado la media esta finalizada
        mediaStream.getVideoTracks()[0].addEventListener("ended", () => {
            mediaRecorder.stop();
        })

    } catch (error) {
        console.log(error);
        status.textContent = "⚫Algo salio en el proseso"
    }
})