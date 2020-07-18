import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = document.getElementById('app');
app.innerHTML = `
  <div class="jumbotron jumbotron-fluid bg-dark">
    <div class="container-xl">
      <div class="row">
        <div class="col-lg-8 mx-auto text-white">
          <h1 class="display-3">RSS aggregator</h1>
          <p class="lead">This is a RSS aggregator. Try it below!</p>
          <hr class="my-4">
          <form class="form-inline">
            <div class="row">
              <div class="form-group mx-sm-3 mb-2">
                <label for="rssLink" class="sr-only">RSS link</label>
                <input type="password" class="form-control" id="rssLink" placeholder="RSS link">
              </div>
              <button type="submit" class="btn btn-primary">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;
