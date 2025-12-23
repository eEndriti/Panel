const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Perdoruesit
    getPerdoruesit: () => ipcRenderer.invoke('get-perdoruesit'),
    createPerdorues: (data) => ipcRenderer.invoke('create-perdorues', data),
    updatePerdorues: (id, data) => ipcRenderer.invoke('update-perdorues', id, data),
    deletePerdorues: (id) => ipcRenderer.invoke('delete-perdorues', id),

    // Klientet
    getKlientet: () => ipcRenderer.invoke('get-klientet'),
    createKlient: (data) => ipcRenderer.invoke('create-klient', data),
    updateKlient: (id, data) => ipcRenderer.invoke('update-klient', id, data),
    deleteKlient: (id) => ipcRenderer.invoke('delete-klient', id),

    // Produktet
    getProduktet: () => ipcRenderer.invoke('get-produktet'),
    createProdukt: (data) => ipcRenderer.invoke('create-produkt', data),
    updateProdukt: (id, data) => ipcRenderer.invoke('update-produkt', id, data),
    deleteProdukt: (id) => ipcRenderer.invoke('delete-produkt', id),

    // Faturat
    getFaturat: () => ipcRenderer.invoke('get-faturat'),
    getFaturaMeId: (id) => ipcRenderer.invoke('getFaturaMeId',id),
    createFature: (data) => ipcRenderer.invoke('create-fature', data),
    updateFature: (id, data) => ipcRenderer.invoke('update-fature', id, data),
    deleteFature: (id) => ipcRenderer.invoke('delete-fature', id),
    getNrPaPaguar: () => ipcRenderer.invoke('getNrPaPaguar'),
    getInvoiceNr: () => ipcRenderer.invoke('getInvoiceNr'),
    // Transaksionet
    getTransaksionet: () => ipcRenderer.invoke('get-transaksionet'),
    createTransaksion: (data) => ipcRenderer.invoke('create-transaksion', data),
    updateTransaksion: (id, data) => ipcRenderer.invoke('update-transaksion', id, data),
    deleteTransaksion: (id) => ipcRenderer.invoke('delete-transaksion', id),

    // Kompania
    getKompania: () => ipcRenderer.invoke('get-kompania'),
    updateKompania: (id, data) => ipcRenderer.invoke('update-kompania', id, data),

    // Parametrat
    getParametrat: () => ipcRenderer.invoke('get-parametrat'),
    createParametar: (data) => ipcRenderer.invoke('create-parametar', data),
    updateParametar: (id, data) => ipcRenderer.invoke('update-parametar', id, data),
    deleteParametar: (id) => ipcRenderer.invoke('delete-parametar', id),


    savePDF: (data) => ipcRenderer.send('savePDF', data  ),
    openFile: (filePath) => ipcRenderer.send('openFile', filePath),
});
