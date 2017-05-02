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

                this.calendarReminders = localStorage.getItem('calendarReminders');
            if (this.calendarReminders != null) 
                this.calendarReminders = JSON.parse(this.calendarReminders);
            else
                this.calendarReminders = new Object();

        } else {
            alert('Não tem LocalStorage');
            return false;
        }
    },

    // type: E -> eventos, L -> Lembretes
    saveData: function(key, value, type)
    {
        
        if(type == 'E'){
            this.ce[key] = value; // Adiciona evento
            localStorage.setItem('calendarEvents', JSON.stringify(this.ce));
        }else{
            this.calendarReminders[key] = value; // adiciona lembrete
            localStorage.setItem('calendarReminders', JSON.stringify(this.calendarReminders));
        }

    },

    getData(key, type)
    {
        console.log('tipo ' + type);
        // Procura pela chave
        if(type == 'E'){
            return this.ce[key];
        }
        return this.calendarReminders[key];        
    }
}
