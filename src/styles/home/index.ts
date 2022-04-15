import styled from 'styled-components'

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
            }

            .tab-bottom {
                width: 100%;
                height: 16px;
                background: ${props => props.theme.colors.primary};
            }
        }
    }

    .container {
        padding-top: 2.5rem;
        padding-bottom: 2.5rem;
        font-family: 'Vidaloka', sans-serif;

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
                width: 420px;
                height: 58px;
                border: 2px solid ${props => props.theme.colors.primary};
                border-radius: 3px;
            }

            button {
                margin: auto;
                margin-top: 1rem;
                width: 420px;
                height: 63px;
                background: ${props => props.theme.colors.primary};
                color: #fff;
                /* border: none; */
                border: 2px solid ${props => props.theme.colors.primary};
                /* border-radius: 3px; */
            }
        }


    }
`