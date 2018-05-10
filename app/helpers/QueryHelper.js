class QueryHelper {
    
    constructor() { 
        throw new Error('Esta classe não pode ser instanciada');
    }
    
    static setLimitQuery(filter) {
        let page = (filter.page == 0 ? filter.page : filter.page * 20);
        let items= (filter.items == 0 ? null : filter.items);
    
        let limit = ``;
    
        if (items){
            limit = `LIMIT ${page}, ${items}`;
        }
    
        return limit;  
    }

    static getNowQuery (){
        return { toSqlString: function() { return 'NOW()'; } };
    }

}


module.exports = QueryHelper;