import React, { Component } from 'react';
import Axios, { AxiosResponse } from 'axios';
import ls from "local-storage";
import ImageCard, { ImageUrls } from './imageCard';
import { ThemedCSSProperties, ThemeContext } from '../../../contexts/themeContext';

interface Props {
    view: string
}
interface State {
    imagesUrls: ImageUrls[],
    isLoading: boolean,
    likedImages: ImageUrls[],
    isLiked: boolean
}
  

export default class ImageSection extends Component<Props, State> {
    /** Not a good place for the key.. well.. what the heck.. - GET YOUR OWN! */
    readonly accessKey = "09e0a83167d809d6ee63ebd7c62f2f20b0ad082f9208fcffc5871c7287183b3d";
    readonly imageDatabaseApiUrl = "https://api.unsplash.com/search/photos/";
    constructor(props:Props){
        super(props)
        
        this.state = {
            imagesUrls: new Array(24).fill({}),
            isLoading: true,
            likedImages: [],
            isLiked: false
        }
    }

    
    
    handleResponse(response: AxiosResponse) {
        if (response.data && response.data.results) {
            const images = response.data.results.map((img: any) => img.urls)
            this.setState({ imagesUrls: images, isLoading: false })
        }
    }

    componentDidUpdate(){
        
    }
  
    handleLikedImage = (urls: ImageUrls) => {
        let storageArray: string[] = ls.get(this.props.view)
        if(ls.get(this.props.view)){
            storageArray.push(urls.small)
            ls.set(this.props.view, storageArray)
            
        }else {
            ls.set(this.props.view, [urls.small])
        }
        this.setState(prevState => ({
            likedImages: [...prevState.likedImages, urls],
            isLiked: true
        }))
        
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
                         {   
                            this.state.likedImages.map((urls: ImageUrls, index:number) => 
                            <ImageCard likedClick={this.handleLikedImage} 
                            isLiked={true} view={this.props.view} key={index} urls={urls} />
                        )}
                        {this.state.imagesUrls.map((urls, index) =>
                            <ImageCard likedClick={this.handleLikedImage} 
                            isLiked={false} view= {this.props.view} key={index} urls={urls} />
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