import Icon from './loading.svg';
import './loading.sass';

const Loading = () => {
    return (
        <div className="loading">
            <div className="loading__center">
                <h2 className="loading__title">Falet</h2>
                <img src={Icon} className="loading__img" alt="loading" />
                <p className="loading__description">Loading, please wait</p>
            </div>
        </div>
    )
}

export default Loading;