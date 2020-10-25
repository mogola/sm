import React from 'react'

export function getUrlSaved(url) {
    console.log(url)
    return url
}

export const themeContext = React.createContext({
    toggleTheme: () => {
        console.log('default click')
    }
});