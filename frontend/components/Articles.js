import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PT from 'prop-types'

export default function Articles(props) {
  const [ disabled, setDisabled ] = useState(true)
  // ✨ where are my props? Destructure them here
  const { 
      articles, 
      getArticles, 
      deleteArticle, 
      setCurrentArticleId, 
      currentArticleId,
      setMessage
    } = props


  if(!localStorage.getItem('token')){
    // setMessage('Ouch: jwt expired')
    return <Navigate to="/" />
  }

  useEffect(() => { 
    getArticles()
    setDisabled(false)
  }, [])

  console.log('Articles: ', articles)


  return (

    <div className="articles">
      <h2>Articles</h2>
      {
        !articles.length
          ? 'No articles yet'
          : articles.map(art => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button disabled={disabled} onClick={ () => {
                    setCurrentArticleId(art.article_id)
                   } }>Edit</button>
                  <button disabled={disabled} onClick={() => deleteArticle(art.article_id)}>Delete</button>
                </div>
              </div>
            )
          })
      }
    </div>
  )
}

// 🔥 No touchy: Articles expects the following props exactly:
Articles.propTypes = {
  articles: PT.arrayOf(PT.shape({ // the array can be empty
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number, // can be undefined or null
}
