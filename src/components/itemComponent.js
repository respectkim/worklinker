import './itemComponent.css';

function ItemComponent(props){
    return (
        <div className="item">
            <div className="item-line1">
                <span>{props.item.no}</span>
                <span>{props.item.name}</span>
            </div>
            <div className="item-line2">
                {props.item.message}
            </div>
            {/* <div className="item-line3">
                <img src={props.item.image}></img>

            </div> */}

            <div className="item-line3">
                {props.item.image && (
                    <img src={props.item.image} alt={props.item.name} />
                 )}
            </div>
        </div>
    )

}
export default ItemComponent;