const coreData = [];
 
module.exports= class CoreDataModel{
 
    constructor(id, urlCode, title, content, metakeywords, metadescription){
        this.id = id;
        this.urlCode = urlCode;
        this.title = title;
        this.content = content;
        this.metakeywords = metakeywords;
        this.metadescription = metadescription;
    }
    save(){
        coreData.push(this);
    }
    static getAll(){
        return coreData;
    }
}