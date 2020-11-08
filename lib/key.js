module.exports = {
    private: () => {
        return process.env.keyPrivate
    },
    public: () => {
        return process.env.keyPublic
    }
}