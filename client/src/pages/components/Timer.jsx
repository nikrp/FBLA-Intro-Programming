// Displays Stopwach when Adventuring
// Formats it in a nice way.
export default function Timer(data) {
    return (
        <div>
            <span>
                {("0" + Math.floor((data.time / 60000) % 60)).slice(-2)}:
            </span>
            <span>
                {("0" + Math.floor((data.time / 1000) % 60)).slice(-2)}.
            </span>
            <span>
                {("0" + ((data.time / 10) % 100)).slice(-2)}
            </span>
        </div>
    );
}