import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate('/')
   }
  const redirectToArticles = () => { 
    navigate('/articles')
    return
   }

  const logout = () => {

    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
    return
  }

  const login = async ({ username, password }) => {

    setMessage('')
    setSpinnerOn(true)

    try {
      const loginRes = await axios.post(loginUrl, {username, password})

      if (loginRes.status != 200){
        return
      }
      const { message, token } = loginRes.data
      localStorage.setItem("token", token)
      setMessage(message)
      setSpinnerOn(false)
      redirectToArticles()

    } catch (error) {
      console.log('Login Error: ', error)
    }
  }

  const getArticles = async () => {

    setMessage('')
    setSpinnerOn(true)

    try {
      const articlesRes = await axiosWithAuth().get(articlesUrl)

      if (articlesRes.status != 200){
        redirectToLogin()
        return
      }

      const { message, articles } = articlesRes.data
      setMessage(message)
      setArticles(articles)
      setSpinnerOn(false)
      return
      
    } catch (error) {
      console.log('Get Articles Error: ', error)
    }
  }

  const postArticle = async article => {
    setMessage('')
    setSpinnerOn(true)

    try{
      const postRes = await axiosWithAuth().post(articlesUrl, article)

      if (postRes.status != 201){
        setSpinnerOn(false)
        return
      }

      setMessage(postRes.data.message)
      setArticles([...articles, article])
      setSpinnerOn(false)
      return

    } catch(error){
      console.log('Post Article Error: ', error)
    }
  }

  const updateArticle = async ({ article_id, article }) => {
    setSpinnerOn(true)
    try {
      const updateRes = await axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)

      if(updateRes.status != 200){
        return
      }

      console.log('Update Article Response: ', updateRes) //! REMOVE

      
      setMessage(updateRes.data.message)
      setArticles(articles.map(a => a.article_id === article_id ? article : a))
      setSpinnerOn(false)
      // replace the old article with the new one
      redirectToArticles()


    } catch (error) {
      console.log('Update Article Error: ', error)
    }
    
  }

  const deleteArticle = async article_id => {

    setMessage('')
    setSpinnerOn(true)
    try {
      const deleteRes = await axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)

      if(deleteRes.status != 200){
        return
      }

      const { message } = deleteRes.data
      setMessage(message)
      setArticles(articles.filter(art => art.article_id !== article_id))
      setSpinnerOn(false)
      redirectToArticles()

    }
    catch (error) {
      console.log('Delete Article Error: ', error)
    }

   
    
  }

  return (
    <>
      <Spinner on = { spinnerOn } />
      <Message message = { message } />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login = {login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                articles = {articles}
              />
              <Articles 
                articles={articles}
                getArticles = { getArticles }
                deleteArticle = { deleteArticle }
                setCurrentArticleId = { setCurrentArticleId }
                currentArticleId = { currentArticleId }
                updateArticle = { updateArticle }
                setMessage = { setMessage }
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
