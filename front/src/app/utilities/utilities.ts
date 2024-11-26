export class Utilities {
    static toDate(unix_timestamp: any) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = unix_timestamp ? new Date(parseInt(unix_timestamp) * 1000) : false;
        return date;
    }

    static sessionLifeTimeToUnix(lifetime: number) {
        const now = new Date()
        now.setMinutes(now.getMinutes() + lifetime)
        const unixTimestamp = Math.floor(now.getTime() / 1000);
        return unixTimestamp.toString()
    }


    static getCurrentURL() {
        return window.location.href
    }

    static parseJwt(token:any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}