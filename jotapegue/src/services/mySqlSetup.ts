import { BaseDataBase } from '../data/BaseDataBase'


class CreateTables extends BaseDataBase {
    public createTables = async () => {
        try {
            let createdMsg = 'tables created: '

            const jpgUser = 'JPG_USER'
            if (!await this.tableExists(jpgUser)) {
                await this.connection.raw(`
                    CREATE TABLE ${jpgUser}(
                        id VARCHAR(255) PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        nickname VARCHAR(255) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        role ENUM("ADMIN", "NORMAL") DEFAULT "NORMAL"
                    );
                `)
                createdMsg += `${jpgUser}, `
            }

            const jpgImage = 'JPG_IMAGE'
            if (!await this.tableExists(jpgImage)) {
                await this.connection.raw(`
                    CREATE TABLE ${jpgImage}(
                        id VARCHAR(255) NOT NULL PRIMARY KEY,
                        subtitle VARCHAR(255) NOT NULL,
                        author VARCHAR(255) NOT NULL,
                        date DATE NOT NULL,
                        file MEDIUMTEXT NOT NULL,
                        collection VARCHAR(255) NOT NULL
                    );
                `)
                createdMsg += `${jpgImage}, `
            }

            const jpgTag = 'JPG_TAG'
            if (!await this.tableExists(jpgTag)) {
                await this.connection.raw(`
                    CREATE TABLE ${jpgTag}(
                        id VARCHAR(255) PRIMARY KEY,
                        tag VARCHAR(255) UNIQUE NOT NULL
                    );
                `)
                createdMsg += `${jpgTag}, `
            }

            const jpgImageTag = 'JPG_IMAGE_TAG'
            if (!await this.tableExists(jpgImageTag)) {
                await this.connection.raw(`
                    CREATE TABLE ${jpgImageTag}(
                        image_id VARCHAR(255) NOT NULL,
                        tag_id VARCHAR(255) NOT NULL,
                        FOREIGN KEY (image_id) REFERENCES JPG_IMAGE(id),
                        FOREIGN KEY (tag_id) REFERENCES JPG_TAG(id)
                    );
                `)
                createdMsg += `${jpgImageTag}, `
            }
 
            createdMsg !== 'tables created: ' && console.log(createdMsg)
            console.log(`SQL Ok!`)
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
