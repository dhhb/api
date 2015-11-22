export default function () {
    return (req, res, next) => {
        res.setHeader('Cache-control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.setHeader('Expires', 'Sat, 26 Jul 1997 05:00:00 GMT');
        next();
    };
}
