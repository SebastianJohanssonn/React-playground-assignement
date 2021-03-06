import React, { Component } from 'react';
import Axios, { AxiosResponse } from 'axios';
import ls from "local-storage";
import ImageCard, { ImageUrls } from './imageCard';
import { ThemedCSSProperties, ThemeContext } from '../../../contexts/themeContext';

interface Props {
    view: string
}
interface State {
    imagesUrls: ImageUrls[]
    isLoading: boolean
    likedImages: ImageUrls[]
    isLiked: boolean
}
  

export default class ImageSection extends Component<Props, State> {
    /** Not a good place for the key.. well.. what the heck.. - GET YOUR OWN! */
    readonly accessKey = "09e0a83167d809d6ee63ebd7c62f2f20b0ad082f9208fcffc5871c7287183b3d";
    readonly imageDatabaseApiUrl = "https://api.unsplash.com/search/photos/";

        state: State = {
            imagesUrls: new Array(24).fill({}),
            isLoading: true,
            likedImages: [],
            isLiked: true 
        }
    
    handleResponse(response: AxiosResponse) {
        if (response.data && response.data.results) {
            const images = response.data.results.map((img: any) => img.urls)
            this.setState({ imagesUrls: images, isLoading: false })
        }
    }
    componentDidUpdate(){
        if(this.props.view in localStorage && this.state.likedImages.length === 0){
            const storage: ImageUrls[] = ls.get(this.props.view);
            if(storage.length > 0) {
                this.setState({
                    likedImages: this.state.likedImages = [...storage]
                })
            }
        }else {
            ls.set(this.props.view, this.state.likedImages);
        }
    }
  
    handleLikedImage = (urls: ImageUrls, index: number) => {
        
        this.setState({
            likedImages: [...this.state.likedImages, urls]
        });
        
        this.setState({
            imagesUrls: this.state.imagesUrls.filter((_, i) => i !== index)
        });
        
    }
    
    async componentDidMount() {
        try {
            const response = await Axios.get(this.imageDatabaseApiUrl, {
                params: {
                    client_id: this.accessKey,
                    query: this.props.view,
                    page: Math.round(Math.random() * 100),
                    per_page: 24,
                }
            })
            this.handleResponse(response);
        } catch(error) {
            console.error(error)
        }
    }
    

    render() {
        return (
            <ThemeContext.Consumer>
                {({ theme }) => (
                    <div style={root(theme)}>
                        {this.state.likedImages.map((urls, index) =>
                            <ImageCard likedClick={this.handleLikedImage} 
                            isLiked={true} view= {this.props.view} key={index} urls={urls} 
                            index={index}/>
                        )}
                        {this.state.imagesUrls.map((urls, index) =>
                            <ImageCard likedClick={this.handleLikedImage} 
                            isLiked={false} view= {this.props.view} key={index} urls={urls} 
                            index={index}/>
                        )}
                    </div>
                )}
            </ThemeContext.Consumer>
        )
    }
}

const root: ThemedCSSProperties = (theme) => ({
    margin: '3em -1em -1em -1em',
    display: 'flex',
    flexWrap: 'wrap',
    background: `${theme.background.primary}B3`,
    boxShadow: `0 0px 80px 15px ${theme.background.primary}`
})