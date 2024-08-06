<!-- LoadingOverlay.vue -->

<template>
    <div class="custom-loading" v-if="show">
        <div class="loader"></div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        show: Boolean, // Propiedad para controlar la visibilidad
    },

    created() {
    },
    
};
</script>

<style scoped>
.custom-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(55, 55, 57, 0.8); /* Fondo semitransparente */
    display: flex;
    justify-content: center;
    align-items: center;
    /* Personaliza estilos según tus preferencias */
}

.loader {
  border: 12px solid #ffff94; /* Light grey */
  border-top: 12px solid #a87b05; /* Blue */
  border-radius: 50%;
  width: 64px;
  height: 64px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
