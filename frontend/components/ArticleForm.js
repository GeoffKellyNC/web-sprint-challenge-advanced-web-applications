import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { 
    currentArticleId,
    setCurrentArticleId,
    updateArticle,
    currentArticle,
    postArticle,
    articles
  } = props

  useEffect(() => {
 
    if(currentArticle){
      const articleToChange = articles.find(art => art.article_id === currentArticleId)

      setValues({
        title: articleToChange.title,
        text: articleToChange.text,
        topic: articleToChange.topic
      })
    } else {
      setValues(initialFormValues)
    }
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()

    if(currentArticle){
      updateArticle({article_id: currentArticleId, article: values})
      setValues(initialFormValues)
      setCurrentArticleId(null)
      return
    }

    postArticle(values)
    setValues(initialFormValues)
    return


  }

  const isDisabled = () => {

    const { title, text, topic } = values
    return !title || !text || !topic ? true : false
  }

  return (

    <form id="form" onSubmit={onSubmit}>
      <h2>{ currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle">Submit</button>
        {
          currentArticle && (
            <button onClick={
            () => {
            setCurrentArticleId(null)
            setValues(initialFormValues)
          }
        }>Cancel edit</button>
          )
        }
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
