import { BaseDataBase } from '../data/BaseDataBase'


class CreateTables extends BaseDataBase {
    public createTables = async () => {
        try {
            let successMsg = 'tables created: '
            const jpgUser = 'JPG_USER'
            if (!await this.tableExists(jpgUser)) {
                await this.connection.raw(`
                    CREATE TABLE ${jpgUser}(
                        id VARCHAR(255) PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        nickname VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL
                    );
                `)
                successMsg += `${jpgUser}, `
            }

            successMsg !== 'tables created: ' && console.log(successMsg)
        } catch (error) {
            console.log('[Failure to create tables]: error:', error)
        }
    }



    private tableExists = async(tableName: string):Promise<boolean> => {
        const queryResult = await this.connection.raw(`
            SHOW TABLES LIKE "${tableName}";
        `)
        return queryResult[0].length > 0
    }

}


export const createTables:CreateTables = new CreateTables()
