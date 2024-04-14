
class DiaryEntry {
    constructor(db) {
        this.db = db;
    }

    async create(title, description, date) {
        try {
            const insertData = `
                INSERT INTO diary_entries (title, description, date)
                VALUES ('${title}','${description}','${date}')
            `;
            const dbResponse = await this.db.run(insertData);
            const entryId = dbResponse.lastID;
            return `Diary entry with ID ${entryId} created successfully`;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async read() {
        try {
            const entry = await this.db.all(`SELECT * FROM diary_entries`);
            if (!entry) {
                throw new Error(`Diary entries not found`);
            }
            return entry;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async update(title, description, date,entryId) {
        try {
            const updateData = `
                UPDATE diary_entries 
                SET title = '${title}',description = '${description}',date='${date}'
                WHERE entry_id = ${entryId}
                
            `;
            await this.db.run(updateData);
            return `Diary entry with ID ${entryId}  updated successfully`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    
    async delete(entryId) {
        try {
            const deleteData = `
                DELETE FROM diary_entries 
               WHERE entry_id = ${entryId}
                
            `;
            await this.db.run(deleteData);
            return `Diary entry with ID ${entryId} deleted successfully`;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    
}



module.exports = DiaryEntry;
