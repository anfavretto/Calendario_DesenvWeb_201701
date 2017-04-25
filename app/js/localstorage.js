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
        // Lê LocalStorage
        var events = new Array(); 

        // Procura pela chave
        if (this.ce[k] != null)
            events = this.ce[k];
        else
            events = new Array();

        // Adiciona informação
        events.push(v);
        this.ce[k] = events;

        // Salva
        localStorage.setItem('calendarEvents', JSON.stringify(this.ce));
    },

    getData(k, v)
    {

    }
}
