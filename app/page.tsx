import AuthButton from "./components/AuthButton";

export default function Main() {

    const linkStyle = "bg-black text-white p-4 hover:underline ";
    const liStyle = "flex items-center justify-center";

    return (
        <div className="text-xl">
            <div id="navigation_bar">
                <ul className="flex items-center justify-center bg-black">
                    <li className={liStyle}><a href="./todo" className={linkStyle}>TODO List</a></li>
                    <li className={liStyle}><a href="./weather" className={linkStyle}>Weather App (AI)</a></li>
                    <li className={liStyle}><a href="./weatherApi" className={linkStyle}>Weather App (API)</a></li>
                    <li className={liStyle}><a href="./news" className={linkStyle}>News (API)</a></li>
                    <li className={liStyle}><a href="./editor" className={linkStyle}>Text editor</a></li>
                    <li className={liStyle}><a href="./kanban" className={linkStyle}>Kanban Board</a></li>
                </ul>
                <div className="mt-6 text-base">
                    <AuthButton />
                </div>
            </div>
            <h1 className="text-center mt-36">Welcome to my Hub :)</h1>
            <h1 className="text-center">Click in one of the options above</h1>
        </div>
    )
}