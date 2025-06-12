import { supabase } from './api-client.js';
import { parseJSON } from "date-fns";
import { format } from "date-fns";

var isLogged = false;


main();



async function main() {
  checkStatus();
  fetcharticles();
};

async function checkStatus() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Błąd pobierania sesji:", error.message);
    return;
  };
  const nav = document.getElementById("nav")
  console.log(data);
  if (data.session !== null) {
    isLogged = true;
    console.log("Jesteś zalogowany");
    var x = document.createElement("button");
    x.setAttribute("id", "logOut");
    x.className = "inline-block bg-orange-300 hover:bg-orange-700 hover:scale-110 text-white font-bold m-2 py-2 px-4 rounded"
    var t = document.createTextNode("Wyloguj się");
    x.appendChild(t);
    nav.appendChild(x);
    x.addEventListener("click", async (e) => {
      e.preventDefault();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Błąd pobierania sesji:", error.message);
        return;
      };
      nav.innerHTML = '';
      checkStatus();
      fetcharticles()

    });
  } else {
    isLogged = false;
    console.log("Jesteś wylogowany");
    var z = document.createElement('a');
    z.setAttribute("href", "/projekt13/login/");
    var tz = document.createTextNode("Zaloguj się");
    z.className = "inline-block bg-orange-300 hover:bg-orange-700 hover:scale-110 text-white font-bold m-2 py-2 px-4 rounded";
    z.appendChild(tz);
    nav.appendChild(z);
  };

}
async function fetcharticles() {
  const { data, error } = await supabase
    .from('article')
    .select()
    .order('created_at', { ascending: false });
  console.log(data);
  if (error) {
    alert("Nie udało się pobrać danych, spróbuj ponownie");
  };

  const dataStr = data.map(article => {
    if (isLogged === true) {
      return `<div class="article m-5 bg-orange-100 lg:rounded-lg lg:shadow-lg p-2">
      <h2 class="text-2xl font-bold">${article.title}</h2>
      <h3 class="text-xl italic py-2">${article.subtitle}</h3>
      <address  class="text-sm font-bold py-2">${article.author}</address>
      <time datetime="article.created_at" class="text-sm py-2">${format(article.created_at, "dd-MM-yyyy HH:mm")}</time>
      <p class="py-2">${article.content}</p>
      <button type="button"  data-id="${article.id}" class= "editButton bg-orange-300 hover:bg-orange-700 hover:scale-110 text-white  p-1 m-1 rounded">Edytuj artykuł</button>
      <button type="button"  data-id="${article.id}" class= "delButton bg-orange-300 hover:bg-orange-700 hover:scale-110 text-white  p-1 m-1 rounded">Usuń artykuł</button>
    </div>`
    } else {
      return `<div class="article m-5 bg-orange-100 lg:rounded-lg lg:shadow-lg p-2">
      <h2 class="text-2xl font-bold">${article.title}</h2>
      <h3 class="text-xl italic py-2">${article.subtitle}</h3>
      <address  class="text-sm font-bold py-2">${article.author}</address>
      <time datetime="article.created_at" class="text-sm py-2">${format(article.created_at, "dd-MM-yyyy HH:mm")}</time>
      <p class="py-2">${article.content}</p></div>`
    }
  }).join("");
  const fetchedArticles = document.getElementById('articles');
  fetchedArticles.innerHTML = dataStr;
  if (isLogged === true) {
    const addArticle = document.createElement('button');
    const addText = document.createTextNode('Dodaj nowy artykuł');
    const articles = document.getElementById("articles")
    addArticle.appendChild(addText);
    articles.prepend(addArticle);
    addArticle.setAttribute("id", "addArticleButton");
    addArticle.setAttribute("type", "button");
    addArticle.className = "  bg-orange-700 hover:bg-orange-300 hover:scale-110 text-white font-bold m-5 py-2 px-4 rounded";


    const addArticleButton = document.getElementById('addArticleButton');

    addArticleButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const dialogAdd = document.createElement("dialog");
      dialogAdd.innerHTML = `<section class="flex justify-center">
        <form class="flex flex-col gap-4 md:w-2/3 mx-auto">
          <label class="block">Tytuł<input type = "text" class= "block  w-full border rounded m-1 py-1 px-3 text-gray-700 newTitle"></label>
          <label class="block">Podtytuł<input type = "text" class= "block  w-full border rounded m-1 py-1 px-3 text-gray-700 newSubTitle"></label>
          <label class="block">Autor<input type = "text" class= "block  w-full border rounded m-1 py-1 px-3 text-gray-700 newAuthor"></label>
          <label class="block">Treść<textarea class= "block w-full border rounded m-1 py-1 px-3 text-gray-700 newContent"></textarea></label>
          <button id ="AddButtonSubmit" class=" bg-orange-300 hover:bg-orange-700 hover:scale-110 text-white  p-1 m-1 rounded">Wyślij</button>
          <button type="button" id="AddButtonCancel" class ="bg-gray-300 hover:bg-orange-700 hover:scale-110 text-white  p-1 m-1 rounded">Anuluj</button>
        </form></section>`;
      document.body.appendChild(dialogAdd);
      dialogAdd.className = "max-w-md w-full p-6 bg-white rounded shadow-md m-auto";
      dialogAdd.showModal();

      const AddButtonSubmit = document.getElementById('AddButtonSubmit');

      AddButtonSubmit.addEventListener("click", async (e) => {
        e.preventDefault();

        const insertData = {
          title: dialogAdd.querySelector('.newTitle').value.trim(),
          subtitle: dialogAdd.querySelector('.newSubTitle').value.trim(),
          author: dialogAdd.querySelector('.newAuthor').value.trim(),
          content: dialogAdd.querySelector('.newContent').value.trim(),
          created_at: new Date()
        };
        Object.keys(insertData).forEach(key => {
          if (insertData[key] === "") delete insertData[key];
        });
        const { error } = await supabase
          .from('article')
          .insert(insertData);
        if (error) {
          console.error("Błąd dodawania artykułu:", error.message);
          alert("Nie udało się dodać artykułu. Spróbuj ponownie.");
          return;
        };

        dialogAdd.close();
        dialogAdd.remove();
        fetcharticles()
      });
      const cancelAddButton = document.getElementById("AddButtonCancel");
      cancelAddButton.addEventListener("click", () => {
        dialogAdd.close();
        dialogAdd.remove();
      });
      fetcharticles();
    });
    document.querySelectorAll(".delButton").forEach(button => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const articleId = button.dataset.id;
        const { error } = await supabase
          .from('article')
          .delete()
          .eq('id', articleId);
        if (error) {
          console.error("Błąd usuwania artykułu:", error.message);
          alert("Nie udało się usunąć artykułu.");
          return;
        }
        fetcharticles()
      });
    });

    document.querySelectorAll(".editButton").forEach(button => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const dialogEdit = document.createElement("dialog");
        const articleID = button.getAttribute("data-id");
        dialogEdit.innerHTML = `<section class="flex justify-center">
        <form class="flex flex-col gap-4 md:w-2/3 mx-auto">
          <label class="block">Tytuł<input type = "text" class= "block  w-full border rounded m-1 py-1 px-3 text-gray-700 newTitle"></label>
           <label class="block">Podtytuł<input type = "text" class= "block  w-full border rounded m-1 py-1 px-3 text-gray-700 newSubTitle"></label>
          <label class="block">Autor<input type = "text" class= "block  w-full border rounded m-1 py-1 px-3 text-gray-700 newAuthor"></label>
          <label class="block">Treść<textarea class= "block w-full border rounded m-1 py-1 px-3 text-gray-700 newContent"></textarea></label>
          <button class="editButtonSubmit bg-orange-300 hover:bg-orange-700 hover:scale-110 text-white  p-1 m-1 rounded">Wyślij</button>
          <button type="button" id="editButtonCancel" class="bg-gray-300 hover:bg-orange-700 hover:scale-110 text-white  p-1 m-1 rounded">Anuluj</button>       
          </form></section>`;
        document.body.appendChild(dialogEdit);
        const editButtonCancel = document.getElementById("editButtonCancel");
        editButtonCancel.addEventListener("click", () => {
          dialogEdit.close();
          dialogEdit.remove();
        });
        dialogEdit.className = "max-w-md w-full p-6 bg-white rounded shadow-md m-auto";

        dialogEdit.showModal();
        document.querySelectorAll(".editButtonSubmit").forEach(button => {
          button.addEventListener("click", async (e) => {
            e.preventDefault();
            const updateData = {
              title: dialogEdit.querySelector('.newTitle').value.trim(),
              subtitle: dialogEdit.querySelector('.newSubTitle').value.trim(),
              author: dialogEdit.querySelector('.newAuthor').value.trim(),
              content: dialogEdit.querySelector('.newContent').value.trim(),
              created_at: new Date()
            };
            Object.keys(updateData).forEach(key => {
              if (updateData[key] === "") delete updateData[key];
            });
            const { error } = await supabase
              .from('article')
              .update(
                updateData)
              .eq('id', articleID);
            if (error) {
              console.error("Błąd edycji artykułu:", error.message);
              alert("Nie udało się edytować artykułu.");
              return;
            };

            dialogEdit.close();
            dialogEdit.remove();
            fetcharticles()
          })
        })
        fetcharticles();
      });
    });






  }


}

async function addarticle() { }





