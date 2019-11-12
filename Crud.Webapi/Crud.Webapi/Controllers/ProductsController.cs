using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Crud.Webapi.Data;
using Crud.Webapi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Crud.Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly MongoDbContext context;

        public ProductsController(MongoDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Product>> Get()
        {
            try
            {

                IEnumerable<Product> listProduct = this.context.Products.Find(p => true).ToList();
                if (listProduct.Count() == 0)
                {
                    return NoContent();
                }

                return Ok(listProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível listar os produtos!", Error = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult<Department> Post([FromBody] Product entity)
        {
            try
            {
                this.context.Products.InsertOne(entity);
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível incluir o produto!", Error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<Product> Put(string id, [FromBody] Product entity)
        {
            try
            {
                if (id != entity.Id)
                {
                    return BadRequest("ID inválido");
                }

                this.context.Products.ReplaceOne(p => p.Id == id, entity);
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível editar o produto!", Error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("ID não informado!");
                }

                this.context.Products.DeleteOne(pro => pro.Id == id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível deletar o produto!", Error = ex.Message });
            }
        }
    }
}