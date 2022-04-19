import styled from 'styled-components'
import { Modal } from 'react-bootstrap'

export const Container = styled.div`
    width: 100vw;
    height: 100vh;

    header {
        position: relative;
        display: flex;
        width: 100vw;
        height: 450px;
        padding: 0;

        img {
            object-fit: cover;
            object-position: 50% 50%;
            width:100%; 
            height :100%;
        }

        .tab-menu {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 52px;
            position: absolute;
            bottom: 0;
            background: rgba(85, 46, 37, 0.4);

            .menu {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 0px 20px;
                height: 36px;
                list-style: none;
                list-style-type: none;

                a{
                    color: #fff;
                    font-size: 1.3rem;

                    cursor: pointer;
                }

                @media (max-width: 600px){
                    flex-direction: column;
                    height: auto;
                    a {
                        height: auto;
                        padding: 10px 10px 10px 10px;
                    }
                }
            }

            .tab-bottom {
                width: 100%;
                height: 16px;
                background: ${props => props.theme.colors.primary};
            }
            @media (max-width: 600px){
                height: auto;
            }
        }
    }

    .tab-menu {
        .menu {
            a {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                padding-left: 10px;
                padding-right: 10px;
                transition: .2s;
                
                &:hover {
                    background: #A6442E;
                }
            }
        }
    }

    .classActivated {
        background: #A6442E;
    }

    .container {
        padding-top: 2.5rem;
        padding-bottom: 2.5rem;
        font-family: 'Vidaloka', sans-serif;
        overflow-x: hidden !important;

        .tab-pane.active {
            animation: slide-down 0.5s ease-out;
        }

        @keyframes slide-down {
            0% { opacity: 0; transform: translateX(100%); }
            100% { opacity: 1; transform: translateX(0); }
        }

        .nav-tabs {
            display: none;
            visibility: hidden;
        }

        .col-12 {
            & + .col-12 {
                margin-top: 2.5rem;
            }
        }

        .map {
            padding: 0px;
            background: black;
        }

        .img-responsive {
            width: 100%;
            transition: .2s;
            
            &:hover {
                opacity: .9;
            }
        }

        h1 {
            text-align: center;
            font-size: 4rem;
            line-height: 4rem;
            color: ${props => props.theme.colors.title}
        }

        h3 {
            text-align: center;
            font-size: 2.25rem;
            line-height: 2.25rem;
            color: ${props => props.theme.colors.primary}
        }

        p {
            margin: auto;
            max-width: 800px;
            font-family: "Roboto", sans-serif;
            text-align: center;
            font-size: 1.5rem;
            line-height: 1.5rem;
            color: ${props => props.theme.colors.text}
        }

        form {
            display: flex;
            flex-direction: column;
    
            input {
                text-align: center;
                margin: auto;
                max-width: 420px;
                height: 58px;
                border: 2px solid ${props => props.theme.colors.primary};
                border-radius: 3px;
            }

            button {
                display: inline;
                margin: auto;
                margin-top: 1rem;
                width:100%;
                max-width: 420px !important;
                height: 63px;
                background: ${props => props.theme.colors.primary};
                color: #fff;
                border: 2px solid ${props => props.theme.colors.primary};
            }
        }

        .lista {
            transition: .2s;
            background: black;
            &:hover {
                opacity: .9;
            }
        }
  
    }
    .spinner-border {
        color: rgba(255, 255, 255, 0.3)!important;
    }
`

export const ModalConfirmation = styled(Modal)`
    .modal-header {
        background: #A6442E;
        color: #FFFFFF;
    }
    .modal-body {
        .form-data {
            .form-check-input {
                cursor: pointer;
                &:checked {
                    background-color: #A6442E !important;
                    border-color: #A6442E !important;
                }
            }
        }
    }
    .modal-footer {
        button {
            background: #A6442E;
            border-color: #A6442E;

            &:focus:not(.focus-visible) {
              outline: none !important;
              outline:0px !important;
                -webkit-appearance:none;
                box-shadow: none !important;
            }
            &:focus-visible {
              outline: 2px solid #A6442E !important;
            }
        }
    }
`;