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
    public class DepartmentsController : ControllerBase
    {
        private readonly MongoDbContext context;

        public DepartmentsController(MongoDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Department>> Get()
        {
            try
            {
                IEnumerable<Department> listDeparment = this.context.Departments.Find(d => true).ToList();

                if (listDeparment.Count() == 0)
                {
                    return NoContent();
                }

                return Ok(listDeparment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível listar os departamentos!", Error = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult<Department> Post([FromBody] Department entity)
        {
            try
            {
                this.context.Departments.InsertOne(entity);
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível incluir o departamento!", Error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<Department> Put(string id, [FromBody] Department entity)
        {
            try
            {
                if (id != entity.Id)
                {
                    return BadRequest("ID inválido");
                }

                this.context.Departments.ReplaceOne(d => d.Id == id, entity);                               
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível editar o departamento!", Error = ex.Message });
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

                this.context.Departments.DeleteOne(dep => dep.Id == id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Não foi possível deletar o departamento!", Error = ex.Message });
            }
        }
    }
}