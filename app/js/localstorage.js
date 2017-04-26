LS = {

    hasStorage: function()
    {
        if (typeof(Storage) !== "undefined") 
        {
            this.ce = localStorage.getItem('calendarEvents');
            if (this.ce != null) 
                this.ce = JSON.parse(this.ce);
            else
                this.ce = new Object();

        } else {
            alert('Não tem LocalStorage');
            return false;
        }
    },

    saveData: function(k, v)
    {
        // Adiciona informação
        this.ce[k] = v;

        // Salva
        localStorage.setItem('calendarEvents', JSON.stringify(this.ce));
    },

    getData(k, v)
    {
        // Lê LocalStorage
        var eventos = new Array();

        // Procura pela chave
        return this.ce[k];
        
    }
}
