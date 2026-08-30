const Storage = {

    save(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    },


    get(key, defaultValue = null) {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return defaultValue;
        }

        try {

            return JSON.parse(value);

        } catch {

            return defaultValue;
        }
    },


    remove(key) {

        localStorage.removeItem(key);
    }
};