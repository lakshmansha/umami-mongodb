const accountSeeders = async (model) => {
    const isDataExist = await model.findOne({ usename: 'admin' });

    if (!isDataExist) {
        let rtnVal = false;
        const admin = {
            username: 'admin',
            password: '$2b$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcR4A.sUdCznaXiqFXa',
            is_admin: true,
        }

        await model.create({ ...admin })
            .then(docs => {
                console.info(`Admin Account inserted. `);
                rtnVal = true;
            })
            .catch(error => {
                console.error(`Admin Account Seed Error: ${error}`);
            });

        return rtnVal;
    }
};

export { accountSeeders }