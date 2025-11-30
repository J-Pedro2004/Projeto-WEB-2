package com.br.config;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.br.model.Autor;
import com.br.model.Categoria;
import com.br.model.Editora;
import com.br.model.ItemPedido;
import com.br.model.Livro;
import com.br.model.Pedido;
import com.br.model.StatusPedido;
import com.br.repository.AutorRepository;
import com.br.repository.CategoriaRepository;
import com.br.repository.EditoraRepository;
import com.br.repository.LivroRepository;
import com.br.repository.PedidoRepository;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(
            AutorRepository autorRepository,
            EditoraRepository editoraRepository,
            CategoriaRepository categoriaRepository,
            LivroRepository livroRepository,
            PedidoRepository pedidoRepository) {
        
        return args -> {
            // Verifica se já existem dados para não duplicar
            if (autorRepository.count() > 0) {
                System.out.println("Banco de dados já populado. Pulando inserção de dados.");
                return;
            }

            System.out.println("Iniciando população do banco de dados...");

            // Criar Autores
            Autor autor1 = new Autor();
            autor1.setNome("Machado de Assis");
            autor1.setNacionalidade("Brasileiro");
            autor1.setBiografia("Escritor brasileiro, considerado um dos maiores nomes da literatura nacional.");
            autorRepository.save(autor1);

            Autor autor2 = new Autor();
            autor2.setNome("Clarice Lispector");
            autor2.setNacionalidade("Ucraniana-Brasileira");
            autor2.setBiografia("Escritora e jornalista nascida na Ucrânia, naturalizada brasileira.");
            autorRepository.save(autor2);

            Autor autor3 = new Autor();
            autor3.setNome("Jorge Amado");
            autor3.setNacionalidade("Brasileiro");
            autor3.setBiografia("Escritor brasileiro, um dos mais adaptados para cinema, teatro e televisão.");
            autorRepository.save(autor3);

            Autor autor4 = new Autor();
            autor4.setNome("Cecília Meireles");
            autor4.setNacionalidade("Brasileiro");
            autor4.setBiografia("Poetisa, pintora, professora e jornalista brasileira.");
            autorRepository.save(autor4);

            Autor autor5 = new Autor();
            autor5.setNome("Carlos Drummond de Andrade");
            autor5.setNacionalidade("Brasileiro");
            autor5.setBiografia("Poeta, contista e cronista brasileiro, considerado um dos maiores poetas do século XX.");
            autorRepository.save(autor5);

            // Criar Editoras
            Editora editora1 = new Editora();
            editora1.setNome("Companhia das Letras");
            editora1.setRazaoSocial("Companhia das Letras Ltda");
            editora1.setCnpj("12.345.678/0001-90");
            editora1.setTelefone("(11) 3707-3500");
            editora1.setEmail("contato@companhiadasletras.com.br");
            editora1.setWebsite("www.companhiadasletras.com.br");
            editoraRepository.save(editora1);

            Editora editora2 = new Editora();
            editora2.setNome("Record");
            editora2.setRazaoSocial("Record Editora Ltda");
            editora2.setCnpj("23.456.789/0001-01");
            editora2.setTelefone("(21) 2585-2000");
            editora2.setEmail("contato@record.com.br");
            editora2.setWebsite("www.record.com.br");
            editoraRepository.save(editora2);

            Editora editora3 = new Editora();
            editora3.setNome("Saraiva");
            editora3.setRazaoSocial("Saraiva Educação S.A.");
            editora3.setCnpj("34.567.890/0001-12");
            editora3.setTelefone("(11) 3613-3000");
            editora3.setEmail("contato@saraiva.com.br");
            editora3.setWebsite("www.saraiva.com.br");
            editoraRepository.save(editora3);

            // Criar Categorias
            Categoria categoria1 = new Categoria();
            categoria1.setNome("Romance");
            categoria1.setDescricao("Obras de ficção narrativa em prosa");
            categoriaRepository.save(categoria1);

            Categoria categoria2 = new Categoria();
            categoria2.setNome("Poesia");
            categoria2.setDescricao("Obras em verso com expressão artística");
            categoriaRepository.save(categoria2);

            Categoria categoria3 = new Categoria();
            categoria3.setNome("Literatura Brasileira");
            categoria3.setDescricao("Obras de autores brasileiros ou sobre o Brasil");
            categoriaRepository.save(categoria3);

            Categoria categoria4 = new Categoria();
            categoria4.setNome("Clássicos");
            categoria4.setDescricao("Obras consagradas pela crítica literária");
            categoriaRepository.save(categoria4);

            Categoria categoria5 = new Categoria();
            categoria5.setNome("Crônicas");
            categoria5.setDescricao("Textos curtos sobre o cotidiano");
            categoriaRepository.save(categoria5);

            // Criar Livros com relacionamentos
            Livro livro1 = new Livro();
            livro1.setTitulo("Dom Casmurro");
            livro1.setIsbn("978-85-359-0277-1");
            livro1.setAnoPublicacao(1899);
            livro1.setPreco(new BigDecimal("45.90"));
            livro1.setQuantidadeEstoque(25);
            livro1.setSinopse("Romance sobre ciúme e traição narrado por Bentinho.");
            livro1.setAutor(autor1);
            livro1.setEditora(editora1);
            List<Categoria> cats1 = new ArrayList<>();
            cats1.add(categoria1);
            cats1.add(categoria3);
            cats1.add(categoria4);
            livro1.setCategorias(cats1);
            livroRepository.save(livro1);

            Livro livro2 = new Livro();
            livro2.setTitulo("A Hora da Estrela");
            livro2.setIsbn("978-85-209-2634-7");
            livro2.setAnoPublicacao(1977);
            livro2.setPreco(new BigDecimal("38.50"));
            livro2.setQuantidadeEstoque(18);
            livro2.setSinopse("História de Macabéa, uma nordestina perdida no Rio de Janeiro.");
            livro2.setAutor(autor2);
            livro2.setEditora(editora2);
            List<Categoria> cats2 = new ArrayList<>();
            cats2.add(categoria1);
            cats2.add(categoria3);
            livro2.setCategorias(cats2);
            livroRepository.save(livro2);

            Livro livro3 = new Livro();
            livro3.setTitulo("Capitães da Areia");
            livro3.setIsbn("978-85-359-0142-2");
            livro3.setAnoPublicacao(1937);
            livro3.setPreco(new BigDecimal("42.00"));
            livro3.setQuantidadeEstoque(30);
            livro3.setSinopse("Romance sobre meninos de rua em Salvador.");
            livro3.setAutor(autor3);
            livro3.setEditora(editora1);
            List<Categoria> cats3 = new ArrayList<>();
            cats3.add(categoria1);
            cats3.add(categoria3);
            cats3.add(categoria4);
            livro3.setCategorias(cats3);
            livroRepository.save(livro3);

            Livro livro4 = new Livro();
            livro4.setTitulo("Romanceiro da Inconfidência");
            livro4.setIsbn("978-85-526-0345-9");
            livro4.setAnoPublicacao(1953);
            livro4.setPreco(new BigDecimal("55.00"));
            livro4.setQuantidadeEstoque(12);
            livro4.setSinopse("Poemas sobre a Inconfidência Mineira.");
            livro4.setAutor(autor4);
            livro4.setEditora(editora3);
            List<Categoria> cats4 = new ArrayList<>();
            cats4.add(categoria2);
            cats4.add(categoria3);
            livro4.setCategorias(cats4);
            livroRepository.save(livro4);

            Livro livro5 = new Livro();
            livro5.setTitulo("Sentimento do Mundo");
            livro5.setIsbn("978-85-359-0890-2");
            livro5.setAnoPublicacao(1940);
            livro5.setPreco(new BigDecimal("35.90"));
            livro5.setQuantidadeEstoque(20);
            livro5.setSinopse("Coletânea de poemas sobre a condição humana.");
            livro5.setAutor(autor5);
            livro5.setEditora(editora1);
            List<Categoria> cats5 = new ArrayList<>();
            cats5.add(categoria2);
            cats5.add(categoria3);
            cats5.add(categoria4);
            livro5.setCategorias(cats5);
            livroRepository.save(livro5);

            Livro livro6 = new Livro();
            livro6.setTitulo("Memórias Póstumas de Brás Cubas");
            livro6.setIsbn("978-85-359-0278-8");
            livro6.setAnoPublicacao(1881);
            livro6.setPreco(new BigDecimal("40.00"));
            livro6.setQuantidadeEstoque(22);
            livro6.setSinopse("Romance narrado por um defunto autor.");
            livro6.setAutor(autor1);
            livro6.setEditora(editora1);
            List<Categoria> cats6 = new ArrayList<>();
            cats6.add(categoria1);
            cats6.add(categoria3);
            cats6.add(categoria4);
            livro6.setCategorias(cats6);
            livroRepository.save(livro6);

            Livro livro7 = new Livro();
            livro7.setTitulo("A Paixão Segundo G.H.");
            livro7.setIsbn("978-85-209-2635-4");
            livro7.setAnoPublicacao(1964);
            livro7.setPreco(new BigDecimal("43.90"));
            livro7.setQuantidadeEstoque(15);
            livro7.setSinopse("Monólogo interior sobre uma experiência transformadora.");
            livro7.setAutor(autor2);
            livro7.setEditora(editora2);
            List<Categoria> cats7 = new ArrayList<>();
            cats7.add(categoria1);
            cats7.add(categoria3);
            livro7.setCategorias(cats7);
            livroRepository.save(livro7);

            Livro livro8 = new Livro();
            livro8.setTitulo("Gabriela, Cravo e Canela");
            livro8.setIsbn("978-85-359-0143-9");
            livro8.setAnoPublicacao(1958);
            livro8.setPreco(new BigDecimal("48.00"));
            livro8.setQuantidadeEstoque(28);
            livro8.setSinopse("Romance sobre paixão e transformação social em Ilhéus.");
            livro8.setAutor(autor3);
            livro8.setEditora(editora1);
            List<Categoria> cats8 = new ArrayList<>();
            cats8.add(categoria1);
            cats8.add(categoria3);
            livro8.setCategorias(cats8);
            livroRepository.save(livro8);

            // Criar Pedidos com ItemPedido
            Pedido pedido1 = new Pedido();
            pedido1.setNumero("PED-001");
            pedido1.setNomeCliente("João Silva");
            pedido1.setEmailCliente("joao.silva@email.com");
            pedido1.setStatus(StatusPedido.ENVIADO);
            
            List<ItemPedido> itensPedido1 = new ArrayList<>();
            ItemPedido item1_1 = new ItemPedido();
            item1_1.setLivro(livro1);
            item1_1.setQuantidade(2);
            item1_1.setPrecoUnitario(livro1.getPreco());
            item1_1.setPedido(pedido1);
            itensPedido1.add(item1_1);
            
            pedido1.setItens(itensPedido1);
            pedido1.setValorTotal(new BigDecimal("91.80"));
            pedidoRepository.save(pedido1);

            Pedido pedido2 = new Pedido();
            pedido2.setNumero("PED-002");
            pedido2.setNomeCliente("Maria Santos");
            pedido2.setEmailCliente("maria.santos@email.com");
            pedido2.setStatus(StatusPedido.CONFIRMADO);
            
            List<ItemPedido> itensPedido2 = new ArrayList<>();
            ItemPedido item2_1 = new ItemPedido();
            item2_1.setLivro(livro1);
            item2_1.setQuantidade(1);
            item2_1.setPrecoUnitario(livro1.getPreco());
            item2_1.setPedido(pedido2);
            itensPedido2.add(item2_1);
            
            ItemPedido item2_2 = new ItemPedido();
            item2_2.setLivro(livro2);
            item2_2.setQuantidade(1);
            item2_2.setPrecoUnitario(livro2.getPreco());
            item2_2.setPedido(pedido2);
            itensPedido2.add(item2_2);
            
            ItemPedido item2_3 = new ItemPedido();
            item2_3.setLivro(livro3);
            item2_3.setQuantidade(1);
            item2_3.setPrecoUnitario(livro3.getPreco());
            item2_3.setPedido(pedido2);
            itensPedido2.add(item2_3);
            
            pedido2.setItens(itensPedido2);
            pedido2.setValorTotal(new BigDecimal("126.40"));
            pedidoRepository.save(pedido2);

            Pedido pedido3 = new Pedido();
            pedido3.setNumero("PED-003");
            pedido3.setNomeCliente("Pedro Oliveira");
            pedido3.setEmailCliente("pedro.oliveira@email.com");
            pedido3.setStatus(StatusPedido.PENDENTE);
            
            List<ItemPedido> itensPedido3 = new ArrayList<>();
            ItemPedido item3_1 = new ItemPedido();
            item3_1.setLivro(livro4);
            item3_1.setQuantidade(1);
            item3_1.setPrecoUnitario(livro4.getPreco());
            item3_1.setPedido(pedido3);
            itensPedido3.add(item3_1);
            
            ItemPedido item3_2 = new ItemPedido();
            item3_2.setLivro(livro5);
            item3_2.setQuantidade(1);
            item3_2.setPrecoUnitario(livro5.getPreco());
            item3_2.setPedido(pedido3);
            itensPedido3.add(item3_2);
            
            pedido3.setItens(itensPedido3);
            pedido3.setValorTotal(new BigDecimal("90.90"));
            pedidoRepository.save(pedido3);

            System.out.println("✅ Banco de dados populado com sucesso!");
            System.out.println("📚 " + livroRepository.count() + " livros criados");
            System.out.println("✍️ " + autorRepository.count() + " autores criados");
            System.out.println("🏢 " + editoraRepository.count() + " editoras criadas");
            System.out.println("📑 " + categoriaRepository.count() + " categorias criadas");
            System.out.println("🛒 " + pedidoRepository.count() + " pedidos criados");
        };
    }
}
