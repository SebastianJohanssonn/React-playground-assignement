import React, { Component, CSSProperties, Fragment } from 'react';
import Spinner from '../../spinner';
import Modal from '../../modal';
import ls from "local-storage"
import { ThemedCSSProperties, ThemeContext, ThemeState } from '../../../contexts/themeContext';


export interface ImageUrls {
    full: string
    raw: string
    regular: string
    small: string
    thumb: string
}

interface Props {
    urls: ImageUrls
}
interface State {
    isHover: boolean
    isModalOpen: boolean
    heart: string
}

export default class ImageCard extends Component<Props, State> {
    constructor(props:Props){
        super(props)
        this.state = {
            isHover: false,
            isModalOpen: false,
            heart: "heart outline large icon"
        }

        this.likedImage = this.likedImage.bind(this);

        if(!ls.get("likedImages")){
            ls.set("likedImages", this.imageArray);
        }
}
    private imageArray = [];

    style(theme: ThemeState): CSSProperties {
        const hover: CSSProperties = this.state.isHover ? {
            boxShadow: `0 8px 40px -5px ${theme.foreground.darkened}`,
            transform: 'scale(1.05, 1.05) translateY(-1%)'
        } : {}
        return {
            ...imageContainer(theme),
            ...hover
        }
    }

    onMouseEnter = () => this.setState({ isHover: true })
    onMouseLeave = () => this.setState({ isHover: false })
    openModal = () => this.setState({ isModalOpen: true });
    closeModal = () => this.setState({ isModalOpen: false });

    likedImage(event:any) {
        const imageStorage = this.props.urls.small;
        const getImages = ls.get("likedImages");
        if(this.state.heart === "heart large icon"){

            this.setState({ heart: "heart outline large icon"});
            getImages.pop(imageStorage);

        }else {
            this.setState({ heart: "heart large icon" });
            getImages.push(imageStorage);
            
        }
        
        ls.set("likedImages", getImages);
        event.stopPropagation();
    }

    render() {
        return (
            <Fragment>
                <ThemeContext.Consumer>
                    {({ theme }) => (
                        <div
                            style={this.style(theme)}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                            onClick={this.openModal}
                        >
                            {this.props.urls.small ? 
                            <div style={cardContainer}> 
                                <i 
                                    onClick={this.likedImage} 
                                    style={likeIcon} 
                                    className={this.state.heart} 
                                    >
                                </i>
                                <img 
                                    src={this.props.urls.small} 
                                    style={card}
                                /> 
                            </div> 
                            : <Spinner/> }
                        </div>
                    )}
                </ThemeContext.Consumer>
                {
                    this.state.isModalOpen ? (
                        <Modal shouldClose={this.closeModal}>
                            <img src={this.props.urls.regular} style={preview}/>
                        </Modal>
                    ) : null
                }
            </Fragment>
        )
    }
}

const imageContainer: ThemedCSSProperties = (theme) => ({
    margin: '1em',
    flexGrow: 1,
    background: `${theme.background.primary}AA`,
    width: '12em',
    height: '18em',
    transition: 'all 300ms'
})

const card: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
}
const preview: CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
}
const likeIcon: CSSProperties = {
    color: 'grey',
    position: 'absolute',
    top: '8px',
    right: '16px',
    zIndex: 100
}

const cardContainer: CSSProperties = {
    height: '100%',
    position: 'relative'
}