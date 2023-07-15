using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class PortfolioRepository : IPortfolioRepository
    {
        private readonly ApplicationDBContext _context;
        public PortfolioRepository(ApplicationDBContext context)
        {
            _context = context;
            Console.WriteLine("PortfolioRepository initialized.");
        }

        public async Task<Portfolio> CreateAsync(Portfolio portfolio)
        {
            Console.WriteLine($"[CreateAsync] Adding portfolio for StockId={portfolio.StockId}, UserId={portfolio.AppUserId}");
            await _context.Portfolios.AddAsync(portfolio);
            await _context.SaveChangesAsync();
            Console.WriteLine("[CreateAsync] Portfolio created successfully.");
            return portfolio;
        }

        public async Task<Portfolio> DeletePortfolio(AppUser appUser, string symbol)
        {
            Console.WriteLine($"[DeletePortfolio] Attempting to delete portfolio for UserId={appUser.Id}, Symbol={symbol}");

            var portfolioModel = await _context.Portfolios
                .Include(p => p.Stock) // ensure Stock is loaded
                .FirstOrDefaultAsync(x => x.AppUserId == appUser.Id && x.Stock.Symbol.ToLower() == symbol.ToLower());

            if (portfolioModel == null)
            {
                Console.WriteLine($"[DeletePortfolio] No portfolio found for UserId={appUser.Id}, Symbol={symbol}");
                return null;
            }

            _context.Portfolios.Remove(portfolioModel);
            await _context.SaveChangesAsync();
            Console.WriteLine($"[DeletePortfolio] Portfolio deleted successfully for UserId={appUser.Id}, Symbol={symbol}");
            return portfolioModel;
        }

        public async Task<List<Stock>> GetUserPortfolio(AppUser user)
        {
            Console.WriteLine($"[GetUserPortfolio] Fetching portfolio for UserId={user.Id}");

            var stocks = await _context.Portfolios
                .Where(u => u.AppUserId == user.Id)
                .Select(stock => new Stock
                {
                    Id = stock.StockId,
                    Symbol = stock.Stock.Symbol,
                    CompanyName = stock.Stock.CompanyName,
                    Purchase = stock.Stock.Purchase,
                    LastDiv = stock.Stock.LastDiv,
                    Industry = stock.Stock.Industry,
                    MarketCap = stock.Stock.MarketCap
                }).ToListAsync();

            Console.WriteLine($"[GetUserPortfolio] Retrieved {stocks.Count} stock(s) for UserId={user.Id}");
            return stocks;
        }
    }
}
